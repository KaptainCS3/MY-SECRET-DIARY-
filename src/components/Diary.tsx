import data from "../data.json";
interface diaryData {
  id: number;
  imgSrc: string;
  title: string;
  content: string;
  isPrivate: boolean;
  date: string;
  time: string;
}
const Diary = () => {
  return (
    <div>
      {data.map((el: diaryData) => (
        <section className="my-6 w-full" key={el.id}>
          <div className="flex justify-between items-center">
            <img
              src={el.imgSrc}
              alt="diary image"
              className="w-24 border h-full rounded-md"
            />
            <div className="flex flex-col w-[80%] pl-6">
              <h3 className="text-xl">{el.title}</h3>
              <span className="text-[1rem]">
                <span>{el.date}</span>
                <span className="px-2">@</span>
                <span>{el.time}</span>
              </span>
              <span className="flex items-center">
                <small
                  className={`${
                    el.isPrivate ? "text-isPrivate" : "text-isPublic"
                  } italic pr-1 text-sm`}
                >
                  {el.isPrivate ? "Private" : "Public"}
                </small>
                <span className="w-[15px] h-[15px]">
                  <img
                    src={
                      el.isPrivate
                        ? "/assets/isPrivate.png"
                        : "/assets/isPublic.png"
                    }
                    className={`${
                      el.isPrivate
                        ? "w-full h-full"
                        : "w-full h-full -mt-[0.09rem]"
                    } object-contain`}
                  />
                </span>
              </span>
            </div>
          </div>
          <p className="pt-2 text-sm italic">{el.content}</p>
        </section>
      ))}
    </div>
  );
};

export default Diary;
