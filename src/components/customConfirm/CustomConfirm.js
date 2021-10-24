import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const CustomConfirm = () => {
  const MySwal = withReactContent(Swal);

  function JSalert() {
    MySwal.fire({
      icon: "error",
      title: "NOT ALLOWED!",
      text: "You can only process one task at a time!",
      footer: "Just for better organization",
    });
  }
  return { JSalert };
};

export default CustomConfirm;
