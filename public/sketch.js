const form = document.querySelector("form");

form.addEventListener("submit", API, false);
async function API(evt) {
  evt.preventDefault();
  input = form.querySelector("input").value;
  const data = { input };
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  const response = await fetch("/api", options);
  const json = await response.json();
  //   console.log("API" + " " + input);
  console.log(json);
}
