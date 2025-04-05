let peliculas=[]
let generos=[]
let mensaje=null
listarGeneros()



function validarPelicula(){
    if (document.getElementById("txtCodigo").value==""){
        mensaje="Debe ingresar código de la Película"
        return false;
    }else if(document.getElementById("txtTitulo").value==""){
        mensaje="Debe ingresar Título de la Película"
        return false;
    }else if(document.getElementById("txtProtagonista").value==""){
        mensaje="Debe ingresar el Protagonista de la Película"
        return false;
    }else if(document.getElementById('txtDuracion').value==""){
        mensaje="Debe ingresar la duración de la Película"
        return false;
    }else if(document.getElementById('cbGenero').value==""){
        mensaje="Debe seleccionar el género de la Película"
        return false;
    }else if(document.getElementById('txtResumen').value==""){
        mensaje="Debe ingresar un pequeño resumen de la Película"
        return false;
    }else{
        return true;
    }
}

function validarGenero(){
    if (document.getElementById("txtGenero").value==""){
        mensaje="Debe ingresar nombre del género"
        return false
    }
    else{
        return true;
    }
}
function listarPeliculas(){
    url = "/pelicula/"
    fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    })
        .then(respuesta => respuesta.json())
        .then(resultado => {
            peliculas = resultado.peliculas
            console.log(peliculas)
            mostrarPeliculasTabla()
        })
        .catch(error => {
            console.error(error)
        })
}


function listarGeneros(){
    url = "/genero/"
    fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    })
        .then(respuesta => respuesta.json())
        .then(resultado => {
            generos = resultado.generos
            console.log(generos)
        })
        .catch(error => {
            console.error(error)
        })
}


function mostrarPeliculasTabla(){
    let datos=""
   
    peliculas.forEach(pelicula => {
        datos += "<tr>"
        datos += "<td>" + pelicula.codigo + "</td>"
        datos += "<td>" + pelicula.titulo + "</td>"
        datos += "<td>" + pelicula.duracion + "</td>"
        datos += "<td>" + pelicula.protagonista + "</td>"
        let genero = obtenerGenero(pelicula.genero.$oid);        
        datos += "<td>" + genero + "</td>"
        datos += '<td class="text-center" style="font-size:3vh">' +
            '<i class="fa fa-edit text-warning" title="Editar"></i>' +
            '<i class="fa fa-trash text-danger" title="Eliminar"></i></td>'
        datos += '</tr>'
        
    });
    document.getElementById("datosPeliculas").innerHTML = datos

}

function obtenerGenero(id){
    let retorno=""
    for (let index = 0; index < generos.length; index++) {
        const genero = generos[index];        
        if (genero._id.$oid==id){
            retorno= genero.nombre
            break
        }        
    }
    return retorno

}


/**
 * Función que se encarga de hacer
 * una petición al backend para
 * agregar una película.
 */
function agregarPelicula(){
    if (validarPelicula()){
        url = "/pelicula/"
        const pelicula={
            codigo: document.getElementById('txtCodigo').value,
            titulo: document.getElementById('txtTitulo').value,
            protagonista: document.getElementById('txtProtagonista').value,
            duracion: document.getElementById('txtDuracion').value,
            resumen: document.getElementById('txtResumen').value,
            genero: document.getElementById('cbGenero').value,
            foto:''
        }
        fetch(url, {
            method: "POST",
            body: JSON.stringify(pelicula),
            headers: {
                "Content-Type": "application/json",
            }
        })
        .then(respuesta => respuesta.json())
        .then(resultado => {
            if (resultado.estado) {
            location.href = "/peliculas/"
            }else{
                swal.fire("Add Pelicula", resultado.mensaje, "warning")
            }
        })
            .catch(error => {
                console.error(error)
        })
    }else{
        swal.fire("Add Pelicula", mensaje, "warning")
    }
    
}


/**
 * Función que se encarga de hacer
 * una petición al backend para
 * agregar un género.
 */
function agregarGenero(){
    if(validarGenero()){
        const genero = {
            nombre: document.getElementById('txtGenero').value 
        }
        const url= "/genero/"
        fetch(url, {
            method: "POST",
            body: JSON.stringify(genero),
            headers: {
                "Content-Type": "application/json",
            }
        })
        .then(respuesta => respuesta.json())
        .then(resultado => {       
            if (resultado.estado){
                location.href="/generos/"
            }else{
                swal.fire("Add Genero",resultado.mensaje,"warning")
            }
        })
        .catch(error => {
            console.error(error)
        })
    }else{
        swal.fire("Add Genero",mensaje,"warning")
    }
}


/**
 * Función que se encarga de hacer la
 * petición al servidor para actualizar
 * una película de acuerdo con su id
 * @param {*} id 
 */
function editarPelicula(id){
    if(validarPelicula()){
        const pelicula={
            id: id,
            codigo: document.getElementById('txtCodigo').value,
            titulo: document.getElementById('txtTitulo').value,
            protagonista: document.getElementById('txtProtagonista').value,
            duracion: document.getElementById('txtDuracion').value,
            resumen: document.getElementById('txtResumen').value,
            genero: document.getElementById('cbGenero').value,
            foto:''
        }
        const url= "/pelicula/"
        fetch(url, {
            method: "PUT",
            body: JSON.stringify(pelicula),
            headers: {
                "Content-Type": "application/json",
            }
        })
        .then(respuesta => respuesta.json())
        .then(resultado => {       
            if (resultado.estado){
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: resultado.mensaje,
                    showConfirmButton: false,
                    timer: 2000
                  })
                  location.href="/peliculas/"
            }else{
                swal.fire("Edit Pelicula",resultado.mensaje,"warning")
            }
        })
        .catch(error => {
            console.error(error)
        })
    }else{
        swal.fire("Edit Pelicula",mensaje,"warning")
    }
}

/**
 * Función que realiza la petición al servidor
 * para eliminar una película de acuerdo con su id
 * @param {*} id 
 */
function deletePelicula(id){
    Swal.fire({
        title: "¿Está usted seguro de querer eliminar la Película",
        showDenyButton: true,
        confirmButtonText: "SI",
        denyButtonText: "NO"
    }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
            const pelicula={
                id: id,
            }
            const url= "/pelicula/"
            fetch(url, {
                method: "DELETE",
                body: JSON.stringify(pelicula),
                headers: {
                    "Content-Type": "application/json",
                }
            })
            .then(respuesta => respuesta.json())
            .then(resultado => {       
                if (resultado.estado){
                    location.href="/peliculas/"
                }else{
                    swal.fire("Delete Pelicula",resultado.mensaje,"warning")
                }
            })
            .catch(error => {
                console.error(error)
            })
        }
    });
}