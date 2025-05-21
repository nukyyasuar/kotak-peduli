const FormattedWIBDate = ({ date, type }) => {
  if (!date) return null;

  const options = {
    timeZone: "Asia/Jakarta",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };

  if (type === "time") {
    options.hour = "2-digit";
    options.minute = "2-digit";
    options.hour12 = false;
  }

  const formattedDate = new Date(date)
    .toLocaleString("id-ID", options)
    .replace(",", "")
    .replace(/\.(\d{2})$/, ":$1");

  return (
    <>
      {formattedDate} {type === "time" && "WIB"}
    </>
  );
};

export default FormattedWIBDate;
