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

interface Props {
  index: number;
  el: diaryList;
  formattedDate: string;
  formattedTime: string;
  privateFlag: string;
  publicFlag: string;
}

const Skeleton = ({
  index,
  el,
  formattedDate,
  formattedTime,
  privateFlag,
  publicFlag,
}: Props) => {
  return (
    <section className="my-6 w-full" key={index}>
      <div className="flex justify-between items-center">
        <div className="w-[100px] h-[100px]">
          <img
            src={el?.image}
            alt="diary image"
            className="w-full h-full bg-contain border rounded-md"
          />
        </div>
        <div className="flex flex-col w-[80%] pl-6">
          <h3 className="text-xl">{el?.category}</h3>
          <span className="text-[1rem]">
            <span>{formattedDate}</span>
            <span className="px-2">@</span>
            <span>{formattedTime}</span>
          </span>
          <span className="flex items-center font-medium">
            <small
              className={`${
                el?.isPublic ? "text-isPublic" : "text-isPrivate"
              } italic pr-1 text-sm`}
            >
              {el.isPublic ? "Public" : "Private"}
            </small>
            <span className="w-[15px] h-[15px]">
              <img
                src={el.isPublic ? publicFlag : privateFlag}
                className={`${
                  el.isPublic ? "w-full h-full -mt-[0.09rem]" : "w-full h-full"
                } object-contain`}
              />
            </span>
          </span>
        </div>
      </div>
      <p className="pt-2 text-sm italic">{el?.description}</p>
    </section>
  );
};

export default Skeleton;
