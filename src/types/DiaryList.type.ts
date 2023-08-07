export default interface DiaryList{
     id: string;
  image: string;
  category: string;
  description: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  startDate: Date | null | object;
  endDate: Date | null | object;
  userID: string;
}