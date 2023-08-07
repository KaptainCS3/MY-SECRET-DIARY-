export default interface DiaryEntry {
  id: string;
  image: string | null;
  category: string;
  description: string;
  isPublic: boolean;
  createdAt: Date | null | object;
  updatedAt: Date | null | object;
  startDate: Date | null | object;
  endDate: Date | null | object;
  userID: string | undefined;
}