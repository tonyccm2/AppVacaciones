// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyC0zer2obvU5MQrJ2Pe-8_MMCzuwbB-ItU",
    authDomain: "tutoria-electron.firebaseapp.com",
    projectId: "tutoria-electron",
    storageBucket: "tutoria-electron.appspot.com",
    messagingSenderId: "933581286361",
    appId: "1:933581286361:web:bbfe963bc60d1a770fc7c8"
};
// Initialize Firebase

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

const workerForm = document.getElementById('worker-form');
const workersContainer = document.getElementById('workers-container');

//meotodos
const saveWorker = (nombres, apellidos) => 
    db.collection('workers').doc().set({
        nombres,
        apellidos
    })

const getWorkers = () => db.collection('workers').get();

const onGetWorkers = (callback) => db.collection('workers').onSnapshot(callback);

const deleteWorker = id => db.collection('workers').doc(id).delete();

workerForm.addEventListener('submit', async(e) => {
    e.preventDefault();
    const nombres = workerForm['worker-nombres'];
    const apellidos = workerForm['worker-apellidos'];
    await saveWorker(nombres.value, apellidos.value);
    workerForm.reset();
    nombres.focus();
})
// 
window.addEventListener('DOMContentLoaded', async(e)=>{
    onGetWorkers((querySnapshot)=> {
        workersContainer.innerHTML = ''
        querySnapshot.forEach(element => {
            worker = element.data();
            console.log(worker);
            workersContainer.innerHTML += `<div class="container p-1 card card-body mt-2 border-primary">
            <div class="row">
                <p class="col-md-6">${worker.apellidos}, ${worker.nombres}</p>
                <button class="btn btn-primary btn-delete col-md-2" data-id="${element.id}">
                    🗑 Borrar
                </button>
                <p class=col-md-1></p>
                <button class="btn btn-secondary btn-vacation col-md-2" data-id="${element.id}">
                    🖉 Vacaciones
                </button>
                <a href="../vacaciones.html">vaciones</a>
            </div>
        </div>`;

        const btnsDelete = document.querySelectorAll('.btn-delete');
        btnsDelete.forEach(btn => {
            btn.addEventListener('click', async(e) =>{
                await deleteWorker(e.target.dataset.id)
            })
        })

        });
    });
});

