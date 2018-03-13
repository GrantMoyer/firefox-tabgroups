document.addEventListener("DOMContentLoaded", () => {
  ReactDOM.render(
    React.createElement('p', {style: {fontFamily: "sans-serif"}}, "Hello, World!"),
    document.getElementById("content")
  );
});
