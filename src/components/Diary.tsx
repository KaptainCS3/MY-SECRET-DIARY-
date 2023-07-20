import { collection, getDocs } from "firebase/firestore";
import { db } from "../utils/firebase";
import { useEffect, useState } from "react";
import Skeleton from "./Skeleton";
// import { BeatLoader } from "react-spinners";
interface diaryList {
  id: string;
  image: string;
  category: string;
  description: string;
  isPublic: boolean;
  createdDate: Date;
  formattedDate: string;
  formattedTime: string;
}

const Diary = () => {
  const [diaryEntry, setdairyEntry] = useState<null | object | []>([]);
  const privateFlag = import.meta.env.VITE_ISPRIVATE;
  const publicFlag = import.meta.env.VITE_ISPUBLIC;
  const fetchEntry = async () => {
    const diaryRef = collection(db, "diary");
    // Get all diary entries from Firestore
    try {
      const querySnapshot = await getDocs(diaryRef);
      const diaryEntries = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        // Convert the server timestamp to a JavaScript Date object
        const createdDate = data.createdDate.toDate();
        return {
          ...data,
          createdDate,
        };
      });
      console.log("Diary entries: ", diaryEntries);

      setdairyEntry(diaryEntries);
    } catch (error) {
      console.error("Error getting diary entries: ", error);
    }
  };

  useEffect(() => {
    fetchEntry();
  }, []);

  // const diary = dairyEntry
  //   ? dairyEntry?.map((el: object | null) => el.category)
  const diaryList =
    Array.isArray(diaryEntry) &&
    diaryEntry?.map((el: diaryList, index: number) => {
      const monthsOfYear = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const monthOfYear = monthsOfYear[el.createdDate?.getMonth()];
      const date = el.createdDate?.getDate();
      const year = el.createdDate?.getFullYear();
      //! date format
      const formattedDate = `${date} ${monthOfYear} ${year}`;
      //! time formate
      const hours = el.createdDate.getHours();
      const minutes = el.createdDate.getMinutes();
      const formattedTime = `${hours < 10 ? "0" : ""}${hours}:${
        minutes < 10 ? "0" : ""
      }${minutes}`;
      return (
        <Skeleton
          el={el}
          index={index}
          formattedDate={formattedDate}
          formattedTime={formattedTime}
          privateFlag={privateFlag}
          publicFlag={publicFlag}
        />
      );
    });
  console.log(diaryEntry);

  return (
    <>
      {Object.keys(diaryList).length !== 0 ? (
        diaryList
      ) : (
        <p className="text-main text-3xl text-center mt-48">No diary Found</p>
      )}
    </>
  );
};

export default Diary;
