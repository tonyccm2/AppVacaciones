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
const workersContainer1 = document.getElementById('workers-container1');
const workersContainer2 = document.getElementById('workers-container2');
const fechaForm = document.getElementById('fecha-form');
const fechaInt = document.getElementById('fechaInt-form');
const workerRetornar = document.getElementById('worker-retorno');

var fechaHoyGeneral = new Date();
//meotodos
const saveWorker = (dni, nombres, apellidos, area, salida, retorno) => 
    db.collection('workers').doc().set({
        dni,
        apellidos,
        nombres,
        area,
        salida,
        retorno
    })

const getWorkers = () => db.collection('workers').get();

const getWorker = (id) => db.collection("workers").doc(id).get();

const onGetWorkers = (callback) => db.collection('workers').onSnapshot(callback);

const deleteWorker = id => db.collection('workers').doc(id).delete();

const updateWorker = (id, updatedWorker) => db.collection('workers').doc(id).update(updatedWorker);

workerForm.addEventListener('submit', async(e) => {
    e.preventDefault();
    const dni = workerForm['worker-dni'];
    const apellidos = workerForm['worker-nombres'];
    const nombres = workerForm['worker-apellidos'];
    const area = workerForm['worker-area'];
    const salida = workerForm['worker-salida'];

    const fechaHoy = new Date(fechaForm['fecha'].value);
    fechaHoyGeneral = new Date(fechaForm['fecha'].value);
    const fechaSalida = new Date(salida.value);
    var diferencia = fechaHoy.getTime()/(1000 * 3600 * 24) - fechaSalida.getTime()/(1000 * 3600 * 24);
    if(diferencia<-6)
    {
        fechaRetorno = sumarDias(fechaSalida, 30);
        await saveWorker(dni.value, apellidos.value, nombres.value, area.value, salida.value, fechaRetorno);
        workerForm.reset();
        nombres.focus();
    }else{
        alert("usted debe programar sus vacaciones con minimo 7 días de anticipación");
    }
})
// 
window.addEventListener('DOMContentLoaded', async(e)=>{
    onGetWorkers((querySnapshot)=> {
        workersContainer1.innerHTML = '<p class="h4">Vacaciones activas</p>'
        workersContainer2.innerHTML = '<p class="h4">Vacaciones pasadas</p>'
        querySnapshot.forEach(element => {
            worker = element.data();
            var fechaRetorno = new Date(worker.retorno);
            var diferencia = (fechaHoyGeneral.getTime()/(1000 * 3600 * 24)) - (fechaRetorno.getTime()/(1000 * 3600 * 24));   
            console.log(diferencia)
            if(diferencia <= 0)
            {
                workersContainer1.innerHTML += `<div class="container p-1 card card-body mt-2 border-primary">
                    <div class="row">
                        <div class="col-md-6">
                            <p>${worker.area}, ${worker.dni}</p>
                            <p>${worker.apellidos}, ${worker.nombres}</p>
                            <p>Fecha Salida: ${worker.salida}</p>
                            <p>Fecha Retorno: ${worker.retorno}</p>
                        </div>
                        <container class="align-middle col-md-5">
                            <div class="d-flex justify-content-end">
                                <p class=col-md-1></p>
                                <button class="btn btn-secondary btn-interrumpir" data-id="${element.id}">
                                    🖉 Interrumpir
                                </button>
                            </div>
                        </container>
                    </div>
                </div>`;
            }else{
                workersContainer2.innerHTML += `<div class="container p-1 card card-body mt-2 border-primary">
                    <div class="row">
                        <div class="col-md-6">
                            <p>${worker.area}, ${worker.dni}</p>
                            <p>${worker.apellidos}, ${worker.nombres}</p>
                            <p>Fecha Salida: ${worker.salida}</p>
                            <p>Fecha Retorno: ${worker.retorno}</p>
                        </div>
                        <container class="align-middle col-md-5">
                            <div class="d-flex justify-content-end">
                                <button class="btn btn-primary btn-delete" data-id="${element.id}">
                                    🗑 Borrar
                                </button>
                            </div>
                        </container>
                    </div>
                </div>`;
            }
            
 
            const btnsDelete = document.querySelectorAll('.btn-delete');
            btnsDelete.forEach(btn => {
                btn.addEventListener('click', async(e) =>{
                    var fechaHoy = new Date(fechaForm['fecha'].value);
                    const doc = await getWorker(e.target.dataset.id);
                    const trabajador = doc.data();
                    var fechaRetorno = new Date(trabajador.retorno);
                    var diferencia = fechaHoy.getTime()/(1000 * 3600 * 24) - fechaRetorno.getTime()/(1000 * 3600 * 24);
                    if(diferencia >= 0)
                    {
                        await deleteWorker(e.target.dataset.id)
                        alert("las vacaciones fueron eliminadas con éxito");
                    }else
                    {
                        alert("las vacaciones aun no acabaron, puede interrumpir o esperar a que acabe para borrar")
                    }
                    fechaHoyGeneral = fechaHoy;
                    
                })
            })
            const btnsInterrumpir = document.querySelectorAll('.btn-interrumpir');
            btnsInterrumpir.forEach(btn => {
                btn.addEventListener('click', async(e) =>{
                    if (fechaForm['fecha'].value == "")
                    {
                        var fechaHoy = new Date();
                    }else{
                        var fechaHoy = new Date(fechaForm['fecha'].value);
                    }
                    const doc = await getWorker(e.target.dataset.id);
                    id = doc.id;
                    const trabajador = doc.data();
                    var fechaSalida = new Date(trabajador.salida);
                    var diferencia = fechaHoy.getTime()/(1000 * 3600 * 24) - fechaSalida.getTime()/(1000 * 3600 * 24);
                    fechaRetorno = sumarDias(fechaHoy, 0);
                    if(diferencia < 7)
                    {
                        alert("las vacaciones solo se pueden interrumpir si ya pasó un minimo de 7 días")
                    }else{
                        if(diferencia >= 30)
                        {
                            alert("las vacaciones de este trabajador ya acabaron, puede eliminarlo sin problemas")
                        }else{
                            await updateWorker(id, {
                                dni: trabajador.dni,  
                                apellidos: trabajador.apellidos, 
                                nombres: trabajador.nombres, 
                                area: trabajador.area, 
                                salida: trabajador.salida, 
                                retorno: fechaRetorno,
                            })
                            alert("las vacaciones fueron interrumpidas con exito, y se modifico la salida del trabajador")
                        }
                    }
                    fechaHoyGeneral = fechaHoy;
                })
            })
        });
    });
});


function sumarDias(fecha, dias){
    fecha.setDate(fecha.getDate() + dias);
    var numeroDia = new Date(fecha).getDay();
    if(numeroDia == 6)
    {
       fecha.setDate(fecha.getDate() + 2);
    }if(numeroDia == 0)
    {
       fecha.setDate(fecha.getDate() + 1);
    }
    numeroDia = new Date(fecha).getDay();
    return fecha.toDateString();

  }