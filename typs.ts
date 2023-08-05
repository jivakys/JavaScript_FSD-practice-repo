export enum DatabaseModel {
  users = "users",
  posts = "posts",
  comments = "comments",
  likes = "likes",
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

interface IUser {
  name: string;
  bio: string;
  email: string;
  follows: number[];
}

export class User extends Model implements IUser {
  name: string;
  bio: string;
  email: string;
  follows: number[];

  constructor(name: string, bio: string, email: string) {
    super(DatabaseModel.users);
    this.name = name;
    this.bio = bio;
    this.email = email;
    this.follows = [];
    Database.Instance?.create(DatabaseModel.users, this);
  }
  follow(userID: number) {
    return this.follows.push(userID);
  }

  get followers() {
    return this.follows.length;
  }

  get posts() {
    return Database.connect().Posts.filter((post) => {
      post.userID == this.id;
    }).length;
  }

  createPost(image: string, content: string) {
    return new Post(image, content, this.id);
  }
}

interface IPost {
  image: string;
  content: string;
  userID: number;
}

export class Post extends Model implements IPost {
  image: string;
  content: string;
  userID: number;
  constructor(image: string, content: string, userID: number) {
    super(DatabaseModel.posts);
    this.image = image;
    this.content = content;
    this.userID = userID;
    Database.Instance?.create(DatabaseModel.posts, this);
  }

  get likes(): number {
    return Database.connect().Likes.filter(
      (like) => like.parentID === this.id && like.type === "POST"
    ).length;
  }

  Like(userID: number) {
    return new Like("POST", userID, this.id);
  }

  Comment(userID: number) {
    return new Comment(this.content, userID, this.userID);
  }
}

interface IComment {
  content: string;
  userID: number;
  postID: number;
}

export class Comment extends Model implements IComment {
  content: string;
  userID: number;
  postID: number;
  constructor(content: string, userID: number, postID: number) {
    super(DatabaseModel.comments);
    this.content = content;
    this.userID = userID;
    this.postID = postID;
    Database.Instance?.create(DatabaseModel.comments, this);
  }

  get likes(): number {
    return Database.connect().Likes.filter(
      (like) => like.type === "COMMENT" && like.parentID === this.id
    ).length;
  }

  Like(userID: number) {
    return new Like("COMMENT", userID, this.id);
  }
}

interface ILike {
  type: "POST" | "COMMENT";
  userID: number;
  parentID: number;
}

export class Like extends Model implements ILike {
  type: "POST" | "COMMENT";
  userID: number;
  parentID: number;
  constructor(type: "POST" | "COMMENT", userID: number, parentID: number) {
    super(DatabaseModel.likes);
    this.type = type;
    this.userID = userID;
    this.parentID = parentID;
    Database.Instance?.create(DatabaseModel.likes, this);
  }
}

export class Database {
  private users: IUser[];
  private posts: IPost[];
  private comments: IComment[];
  private likes: ILike[];

  static Instance: Database | null = null;

  static connect() {
    if (Database.Instance == null) {
      Database.Instance = new Database();
    }
    return Database.Instance;
  }

  private constructor() {
    this.users = [];
    this.comments = [];
    this.posts = [];
    this.likes = [];
  }

  get Users() {
    return this.users;
  }

  get Likes() {
    return this.likes;
  }

  get Comments() {
    return this.comments;
  }

  get Posts() {
    return this.posts;
  }

  create(model: DatabaseModel, data: any) {
    if (model == DatabaseModel.users) {
      return this.users.push(data);
    } else if (model == DatabaseModel.posts) {
      return this.posts.push(data);
    } else if (model == DatabaseModel.likes) {
      return this.likes.push(data);
    } else if (model == DatabaseModel.comments) {
      return this.comments.push(data);
    } else {
      throw Error("Invalid Model");
    }
  }

  upsert() {}
  delete() {}
}
