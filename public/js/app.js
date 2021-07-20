document.querySelector(".btn").addEventListener('click', () => {
    window.print();
    // document.querySelector(".tab").style.bordercolor ="White";
});
window.onbeforeprint = () => {document.querySelector(".btn").style.display = "none"};
window.onbeforeprint = () => {document.querySelector("#file").style.opacity = 0};
window.onafterprint = () => {document.querySelector(".btn").style.display = "block"};
window.onafterprint = () => {document.querySelector("#file").style.opacity=1};
// patient = document.querySelector("#patentpic");
// patient.addEventListener("onchange", ()=>{
//     console.log(patient.src);
// })
function loadFile(event) {
	var image = document.getElementById('output');
	image.src = URL.createObjectURL(event.target.files[0]);
};