const dropArea = document.querySelector(".add__drag-area");
const dragText = document.querySelector(".add__drag-area--title");
const button = document.querySelector(".add__drag-area--btn");
const input = document.querySelector("#input-file");
let files;

button.addEventListener("click", (e) => {
  input.click();
});

input.addEventListener("change", (e) => {
  files = input.files;
  dropArea.classList.add("active");
  showFile(files);
  dropArea.classList.remove("active");
});

dropArea.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropArea.classList.add("active");
  dragText.textContent = "Suelta para subir los archivos";
});

dropArea.addEventListener("dragleave", (e) => {
  e.preventDefault();
  dropArea.classList.remove("active");
  dragText.textContent = "Arrastra y suelta imágenes";
});

dropArea.addEventListener("drop", (e) => {
  e.preventDefault();
  files = e.dataTransfer.files;
  showFile(files);
  dropArea.classList.remove("active");
  dragText.textContent = "Arrastra y suelta imágenes";
});

function showFile(files) {
  if (files.length === undefined) {
    processFile(files);
  } else {
    for (const file of files) {
      processFile(file);
    }
  }
}

function processFile(file) {
  const docType = file.type;
  const validExtensions = ["image/jpeg", "image/jpg", "image/png", "image/gif"];

  if (validExtensions.includes(docType)) {
    //archivo válido
    const fileReader = new FileReader();
    const id = `file-${Math.random().toString(32).substring(7)}`;

    fileReader.addEventListener("load", (e) => {
      const fileUrl = fileReader.result;
      const image = `
        <div id="${id}" class="file-container">
            <img src="${fileUrl}" alt="${file.name}" width="50px">
            <div class="status">
                <span>${file.name}</span>
                <span class="status-text">Loading...</span>
            </div>
        </div>
        `;

      const html = document.querySelector(".add__drag--preview").innerHTML;
      document.querySelector(".add__drag--preview").innerHTML = image + html;
    });

    fileReader.readAsDataURL(file);
    uploadFile(file, id);
  } else {
    //no es un archivo válido
    alert("No es un archivo válido");
  }
}

async function uploadFile(file,id) {
    const formData = new FormData();
    formData.append("file",file);

    try {

        const response = await fetch("http://localhost:3000/upload", {
            method: "POST",
            body: formData,
        });

        const responseText = await response.text();
        console.log(responseText);

        document.querySelector(`#${id} .status-text`).innerHTML = `<span class="success">Archivo subido correctamente ...</span>`;

    } catch (error) {
        document.querySelector(`#${id} .status-text`).innerHTML = `<span class="failure">El archivo no pudo subirse ...</span>`;
    }

}