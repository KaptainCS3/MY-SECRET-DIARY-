import { collection, getDocs } from "firebase/firestore";
import { db } from "../utils/firebase";
import { useEffect } from "react";
import Skeleton from "./Skeleton";
import { useAppDispatch, useAppSelector } from "../hooks/hook";
import { diaryListItems } from "../features/DiaryList";
import { RootState } from "../app/store";
// import { BeatLoader } from "react-spinners";
// interface diaryList {
//   id: string;
//   image: string;
//   category: string;
//   description: string;
//   isPublic: boolean;
//   createdDate: Date;
// formattedDate: string;
// formattedTime: string;
// }

const Diary = () => {
  const diaryEntry = useAppSelector((state: RootState) => state.diaryList.list);

  // const [diaryEntry, setdairyEntry] = useState<null | object | []>(null);
  const dispatch = useAppDispatch();
  // const privateFlag = import.meta.env.VITE_ISPRIVATE;
  const privateFlag = "/assets/isPrivate.png";
  // const publicFlag = import.meta.env.VITE_ISPUBLIC;
  const publicFlag = "/assets/isPublic.png";
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
          id: doc.id,
          image: data.image,
          category: data.category,
          description: data.description,
          isPublic: data.isPublic,
          createdDate,
        };
      });
      console.log("Diary entries: ", diaryEntries);
      // setdairyEntry(diaryEntries);
      dispatch(diaryListItems(diaryEntries));
    } catch (error) {
      console.error("Error getting diary entries: ", error);
    }
  };

  useEffect(() => {
    fetchEntry();
  }, []);

  //   ? dairyEntry?.map((el: object | null) => el.category)
  const diaryList =
    Array.isArray(diaryEntry) &&
    diaryEntry?.map((el, index: number) => {
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
