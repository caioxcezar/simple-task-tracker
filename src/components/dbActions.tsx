import useDb from "@/hooks/useDb";
import Image from "next/image";
import { toast } from "react-toastify";

const DbActions = ({ onAction }: { onAction: () => void }) => {
  const db = useDb();
  return (
    <div className="absolute bottom-0 right-0 m-2 flex gap-2">
      <Image
        src="upload.svg"
        width={50}
        height={50}
        alt="Upload DataBase"
        onClick={() =>
          db
            .import()
            .then(onAction)
            .then(() => toast.success("Uploaded"))
            .catch((err) => toast.error(err.Message))
        }
      />
      <Image
        src="download.svg"
        width={50}
        height={50}
        alt="Download DataBase"
        onClick={() =>
          db
            .export()
            .then(() => toast.success("Downloaded"))
            .catch((err) => toast.error(err.Message))
        }
      />
    </div>
  );
};
export default DbActions;
