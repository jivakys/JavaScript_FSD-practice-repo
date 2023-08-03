export enum DatabaseModel {
  users = "users",
  videos = "videos",
  notifications = "notifications",
}

interface IModel {
  id: number;
  model: DatabaseModel;
}
export abstract class Model implements IModel {
  id: number;
  model: DatabaseModel;
  constructor(model: DatabaseModel) {
    this.id = Math.random();
    this.model = model;
  }
}

interface IUser extends IModel {
  name: string;
  email: string;
  type: "Consumer" | "Creator";
}

export abstract class UserModel extends Model implements IUser {
  name: string;
  email: string;
  type: "Consumer" | "Creator";
  constructor(name: string, email: string, type: "Consumer" | "Creator") {
    super(DatabaseModel.users);
    this.name = name;
    this.email = email;
    this.type = type;
  }
}

interface IConsumer extends IUser {
  isPremium: boolean;
  subscibedChannels: number[];
}

export class ConsumerModel extends UserModel implements IConsumer {
  isPremium: boolean;
  subscibedChannels: number[];
  constructor(name: string, email: string) {
    super(name, email, "Consumer");
    this.isPremium = false;
    this.subscibedChannels = [];

    Database.Instance?.users.push({
      id: this.id,
      name: this.name,
      email: this.email,
      model: this.model,
      type: this.type,
      isPremium: this.isPremium,
      subscibedChannels: this.subscibedChannels,
    });
  }
  subscribe(creatorID: number) {
    if (Database.Instance === null) return;
    this.subscibedChannels.push(creatorID);
    Database.Instance.users = Database.Instance?.users.map((ele) => {
      if (ele.id === this.id) {
        return {
          id: this.id,
          name: this.name,
          email: this.email,
          model: this.model,
          type: this.type,
          isPremium: this.isPremium,
          subscibedChannels: this.subscibedChannels,
        };
      } else {
        return ele;
      }
    });
  }

  viewNotifications() {
    if (Database.Instance === null) return;
    const notification = Database.Instance?.notifications.filter((ele) => {
      if (ele.userID === this.id && ele.hasRead === false) {
        return true;
      }
      return false;
    });

    Database.Instance.notifications = Database.Instance?.notifications.map(
      (element) => {
        if (element.id === this.id) {
          return { ...element, hasRead: true };
        }
        return element;
      }
    );
    return notification;
  }
}

interface ICreator extends IUser {
  noOfSubscribers: number;
}

export class CreatorModel extends UserModel implements ICreator {
  noOfSubscribers: number;
  constructor(name: string, email: string) {
    super(name, email, "Creator");
    this.noOfSubscribers = 0;

    Database.Instance?.users.push({
      id: this.id,
      name: this.name,
      email: this.email,
      model: this.model,
      type: this.type,
      noOfSubscribers: this.noOfSubscribers,
    });
  }
  uploadVideo(link: string, title: string, categories: string[]) {
    const vid = new VideoModel(link, title, categories, this.id);
    Database.Instance?.videos.push(vid);
    Database.Instance?.users.forEach((ele) => {
      if (ele.subscibedChannels.includes(this.id) === false) return;
      const notification = new NotificationModel(
        title,
        "This is a video Notification",
        ele.id
      );
      Database.Instance?.notifications.push(notification);
    });
  }
}

interface IVideo extends IModel {
  link: string;
  title: string;
  categories: string[];
  views: number;
  likes: number;
  dislikes: number;
  userID: number;
}
export class VideoModel extends Model implements IVideo {
  link: string;
  title: string;
  categories: string[];
  views: number;
  likes: number;
  dislikes: number;
  userID: number;
  constructor(
    link: string,
    title: string,
    categories: string[],
    userID: number
  ) {
    super(DatabaseModel.videos);
    this.link = link;
    this.title = title;
    this.categories = categories;
    this.userID = userID;
    this.views = 0;
    this.likes = 0;
    this.dislikes = 0;

    Database.Instance?.videos.push({
      id: this.id,
      model: this.model,
      link: this.link,
      title: this.title,
      categories: this.categories,
      userID: this.userID,
      views: this.views,
      likes: this.likes,
      dislikes: this.dislikes,
    });
  }
}

interface INotifications extends IModel {
  title: string;
  description: string;
  userID: number;
  hasRead: boolean;
}

export class NotificationModel extends Model implements INotifications {
  title: string;
  description: string;
  userID: number;
  hasRead: boolean;
  constructor(title: string, description: string, userID: number) {
    super(DatabaseModel.notifications);
    this.title = title;
    this.description = description;
    this.userID = userID;
    this.hasRead = false;
    Database.Instance?.notifications.push({
      id: this.id,
      model: this.model,
      title: this.title,
      description: this.description,
      userID: this.userID,
      hasRead: this.hasRead,
    });
  }
}

export class Database {
  users: any[];
  videos: IVideo[];
  notifications: INotifications[];

  static Instance: Database | null = null;

  private constructor() {
    this.users = [];
    this.videos = [];
    this.notifications = [];
  }
  static connect() {
    if (Database.Instance === null) {
      Database.Instance = new Database();
    }
    return Database.Instance;
  }

  get Users() {
    return this.users;
  }
  get Videos() {
    return this.videos;
  }
  get Notifications() {
    return this.notifications;
  }
  create() {}
  upsert() {}
  delete() {}
}
