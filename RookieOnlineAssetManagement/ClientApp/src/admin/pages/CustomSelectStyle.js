export const customStyles = {
    menu: (provided, state) => ({
      ...provided,
      width: 250,
    }),
  
    control: () => ({
      height: 40,
      width: 250,
      display: "flex",
      alignItems: "center",
      border: "2px solid rgba(0, 0, 0, 0.3)",
      borderRadius: 20,
      paddingLeft: 26,
      fontSize: 14,
      fontWeight: 500,
    }),
  };