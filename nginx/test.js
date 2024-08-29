fetch("http://localhost/api/auth/")
  .then(async (result) => {
    console.log(result);
    const data = await result.json();
    console.log(data.type === "success" ? "Success" : "Failed");
  })
  .catch((err) => console.log(err));
