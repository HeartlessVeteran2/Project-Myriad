// Community and social features for user interaction
export class Community {
  constructor() {
    this.users = new Map(); // userId -> user profile
    this.clubs = new Map(); // clubId -> club data
    this.comments = new Map(); // contentId -> comments array
    this.events = new Map(); // eventId -> event data
    this.friendships = new Map(); // userId -> friends array
    this.notifications = new Map(); // userId -> notifications array
  }

  // User profile management
  createUser(userData) {
    const userId = userData.id || Date.now().toString();
    const user = {
      id: userId,
      username: userData.username,
      email: userData.email,
      displayName: userData.displayName || userData.username,
      avatar: userData.avatar || '/default-avatar.png',
      bio: userData.bio || '',
      joinDate: new Date(),
      stats: {
        mangaRead: 0,
        animeWatched: 0,
        novelsRead: 0,
        clubsJoined: 0,
        friends: 0,
        comments: 0
      },
      preferences: {
        publicProfile: true,
        showActivity: true,
        allowFriendRequests: true
      },
      badges: [],
      reputation: 0
    };
    
    this.users.set(userId, user);
    this.friendships.set(userId, []);
    this.notifications.set(userId, []);
    
    return user;
  }

  // Get user profile
  getUser(userId) {
    return this.users.get(userId);
  }

  // Update user profile
  updateUser(userId, updates) {
    const user = this.users.get(userId);
    if (user) {
      Object.assign(user, updates);
      return user;
    }
    return null;
  }

  // Club management
  createClub(clubData, creatorId) {
    const clubId = Date.now().toString();
    const club = {
      id: clubId,
      name: clubData.name,
      description: clubData.description || '',
      category: clubData.category || 'general',
      avatar: clubData.avatar || '/default-club-avatar.png',
      banner: clubData.banner || '/default-club-banner.png',
      createdBy: creatorId,
      createdAt: new Date(),
      memberCount: 1,
      members: [creatorId],
      moderators: [creatorId],
      rules: clubData.rules || [],
      isPublic: clubData.isPublic !== false,
      tags: clubData.tags || [],
      stats: {
        posts: 0,
        discussions: 0,
        events: 0
      }
    };

    this.clubs.set(clubId, club);
    
    // Update creator's stats
    const creator = this.users.get(creatorId);
    if (creator) {
      creator.stats.clubsJoined++;
    }

    return club;
  }

  // Join club
  joinClub(clubId, userId) {
    const club = this.clubs.get(clubId);
    const user = this.users.get(userId);
    
    if (club && user && !club.members.includes(userId)) {
      club.members.push(userId);
      club.memberCount++;
      user.stats.clubsJoined++;
      
      this.addNotification(userId, {
        type: 'club_joined',
        message: `You joined ${club.name}`,
        clubId: clubId
      });
      
      return true;
    }
    return false;
  }

  // Leave club
  leaveClub(clubId, userId) {
    const club = this.clubs.get(clubId);
    const user = this.users.get(userId);
    
    if (club && user) {
      const memberIndex = club.members.indexOf(userId);
      if (memberIndex > -1) {
        club.members.splice(memberIndex, 1);
        club.memberCount--;
        user.stats.clubsJoined--;
        return true;
      }
    }
    return false;
  }

  // Get clubs
  getClubs(filter = {}) {
    let clubs = Array.from(this.clubs.values());
    
    if (filter.category) {
      clubs = clubs.filter(club => club.category === filter.category);
    }
    
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      clubs = clubs.filter(club => 
        club.name.toLowerCase().includes(searchLower) ||
        club.description.toLowerCase().includes(searchLower)
      );
    }
    
    if (filter.isPublic !== undefined) {
      clubs = clubs.filter(club => club.isPublic === filter.isPublic);
    }
    
    return clubs.sort((a, b) => b.memberCount - a.memberCount);
  }

  // Comment system
  addComment(contentId, userId, commentData) {
    if (!this.comments.has(contentId)) {
      this.comments.set(contentId, []);
    }
    
    const comment = {
      id: Date.now().toString(),
      userId: userId,
      contentId: contentId,
      text: commentData.text,
      parentId: commentData.parentId || null,
      timestamp: new Date(),
      likes: 0,
      dislikes: 0,
      replies: [],
      edited: false,
      editedAt: null
    };
    
    const comments = this.comments.get(contentId);
    
    if (comment.parentId) {
      // It's a reply
      const parentComment = comments.find(c => c.id === comment.parentId);
      if (parentComment) {
        parentComment.replies.push(comment);
      }
    } else {
      // It's a top-level comment
      comments.push(comment);
    }
    
    // Update user stats
    const user = this.users.get(userId);
    if (user) {
      user.stats.comments++;
    }
    
    return comment;
  }

  // Get comments for content
  getComments(contentId, options = {}) {
    const comments = this.comments.get(contentId) || [];
    
    // Sort by timestamp or likes
    const sortBy = options.sortBy || 'timestamp';
    const sortOrder = options.sortOrder || 'desc';
    
    return comments.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      
      if (sortBy === 'timestamp') {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      }
      
      return sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
    });
  }

  // Like/dislike comment
  rateComment(commentId, userId, rating) {
    // Find comment across all content
    for (const comments of this.comments.values()) {
      const comment = comments.find(c => c.id === commentId);
      if (comment) {
        if (rating === 'like') {
          comment.likes++;
        } else if (rating === 'dislike') {
          comment.dislikes++;
        }
        return comment;
      }
    }
    return null;
  }

  // Event management
  createEvent(eventData, creatorId) {
    const eventId = Date.now().toString();
    const event = {
      id: eventId,
      title: eventData.title,
      description: eventData.description || '',
      type: eventData.type || 'general', // 'watch_party', 'discussion', 'contest', 'general'
      startTime: new Date(eventData.startTime),
      endTime: eventData.endTime ? new Date(eventData.endTime) : null,
      location: eventData.location || 'online',
      maxParticipants: eventData.maxParticipants || null,
      createdBy: creatorId,
      createdAt: new Date(),
      participants: [creatorId],
      clubId: eventData.clubId || null,
      isPublic: eventData.isPublic !== false,
      tags: eventData.tags || []
    };

    this.events.set(eventId, event);
    return event;
  }

  // Join event
  joinEvent(eventId, userId) {
    const event = this.events.get(eventId);
    if (event && !event.participants.includes(userId)) {
      if (!event.maxParticipants || event.participants.length < event.maxParticipants) {
        event.participants.push(userId);
        
        this.addNotification(userId, {
          type: 'event_joined',
          message: `You joined the event: ${event.title}`,
          eventId: eventId
        });
        
        return true;
      }
    }
    return false;
  }

  // Get events
  getEvents(filter = {}) {
    let events = Array.from(this.events.values());
    
    if (filter.type) {
      events = events.filter(event => event.type === filter.type);
    }
    
    if (filter.clubId) {
      events = events.filter(event => event.clubId === filter.clubId);
    }
    
    if (filter.upcoming) {
      const now = new Date();
      events = events.filter(event => new Date(event.startTime) > now);
    }
    
    return events.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
  }

  // Friend system
  sendFriendRequest(fromUserId, toUserId) {
    const fromUser = this.users.get(fromUserId);
    const toUser = this.users.get(toUserId);
    
    if (fromUser && toUser && fromUserId !== toUserId) {
      this.addNotification(toUserId, {
        type: 'friend_request',
        message: `${fromUser.displayName} sent you a friend request`,
        fromUserId: fromUserId,
        status: 'pending'
      });
      
      return true;
    }
    return false;
  }

  // Accept friend request
  acceptFriendRequest(userId, friendId) {
    const userFriends = this.friendships.get(userId) || [];
    const friendFriends = this.friendships.get(friendId) || [];
    
    if (!userFriends.includes(friendId)) {
      userFriends.push(friendId);
      friendFriends.push(userId);
      
      this.friendships.set(userId, userFriends);
      this.friendships.set(friendId, friendFriends);
      
      // Update stats
      const user = this.users.get(userId);
      const friend = this.users.get(friendId);
      if (user) user.stats.friends++;
      if (friend) friend.stats.friends++;
      
      // Add notifications
      this.addNotification(friendId, {
        type: 'friend_accepted',
        message: `${this.users.get(userId).displayName} accepted your friend request`,
        userId: userId
      });
      
      return true;
    }
    return false;
  }

  // Get friends
  getFriends(userId) {
    const friendIds = this.friendships.get(userId) || [];
    return friendIds.map(id => this.users.get(id)).filter(Boolean);
  }

  // Notification system
  addNotification(userId, notification) {
    if (!this.notifications.has(userId)) {
      this.notifications.set(userId, []);
    }
    
    const notif = {
      id: Date.now().toString(),
      ...notification,
      timestamp: new Date(),
      read: false
    };
    
    this.notifications.get(userId).unshift(notif);
    
    // Keep only last 100 notifications
    const notifications = this.notifications.get(userId);
    if (notifications.length > 100) {
      notifications.splice(100);
    }
  }

  // Get notifications
  getNotifications(userId, unreadOnly = false) {
    const notifications = this.notifications.get(userId) || [];
    if (unreadOnly) {
      return notifications.filter(n => !n.read);
    }
    return notifications;
  }

  // Mark notification as read
  markNotificationRead(userId, notificationId) {
    const notifications = this.notifications.get(userId) || [];
    const notification = notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      return true;
    }
    return false;
  }

  // Get community statistics
  getStats() {
    return {
      totalUsers: this.users.size,
      totalClubs: this.clubs.size,
      totalEvents: this.events.size,
      totalComments: Array.from(this.comments.values()).reduce((sum, comments) => sum + comments.length, 0),
      activeUsers: Array.from(this.users.values()).filter(u => 
        Date.now() - new Date(u.joinDate).getTime() < 30 * 24 * 60 * 60 * 1000 // joined in last 30 days
      ).length
    };
  }
}
