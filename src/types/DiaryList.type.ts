export default interface DiaryList{
     id: string;
  image: string;
  category: string;
  description: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  userID: string
}