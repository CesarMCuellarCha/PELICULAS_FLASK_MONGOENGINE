from app import app,db, recaptcha
from flask import render_template, request, session, redirect
from models.usuario import Usuario
from dotenv import load_dotenv
import os
import yagmail
import threading

load_dotenv()

@app.route("/")
def inicio():
    return render_template("frmIniciarSesion.html")

def enviarCorreo(email=None, destinatario=None, asunto=None, mensaje=None):
    try:
        email.send(to=destinatario, subject=asunto, contents=mensaje,
                    attachments=["./static/imagenes/film.jpg"])
    except Exception as error:
        print(str(error))


@app.route("/iniciarSesion/",  methods=['POST'])
def iniciarSesion():   
    mensaje = ""
    try:    
        if request.method=='POST':               
            if recaptcha.verify():           
                username=request.form['txtUser']
                password=request.form['txtPassword'] 
                usuario = Usuario.objects(usuario=username,password=password).first()
                if usuario:
                    session['user']=username
                    session['name_user']=f"{usuario.nombres} {usuario.apellidos}"
                    email = yagmail.SMTP("cesarmcuellar@gmail.com",os.environ.get("PASSWORD-ENVIAR-CORREO"), 
                                     encoding="utf-8")
                    asunto = "Ingreso al Sistema"
                    mensaje = f"Cordial saludo <b>{usuario.nombres} {usuario.apellidos}.</b> \
                            Bienvenido a nuestro aplicativo Gestión peliculas. \
                            Enviamos Manual de usuario del aplicativo en formato pdf.<br><br>\
                            Cordialmente,<br><br><br> \
                            <b>Administración<br>Aplicativo Gestión Películas.</b>"
                    thread = threading.Thread(target=enviarCorreo,
                                            args=(email, [usuario.correo,"ccuellar@sena.edu.co"], 
                                                  asunto, [mensaje,"Manual.pdf","./static/imagenes/avatar.png"]))
                    thread.start()
                    return redirect("/home/")
                else:
                    mensaje="Credenciales no válidas"
            else:
                mensaje = "Debe validar primero el recaptcha"
        else:
            mensaje="No permitido"
    except Exception as error:
        mensaje=str(error)
    
    return render_template("frmIniciarSesion.html", mensaje=mensaje)

@app.route("/usuario/", methods=['POST'])
def addUsuario():
    try:
        mensaje=None
        estado=False
        datos= request.get_json(force=True)
        usuario = Usuario(**datos)
        usuario.save()
        estado=True
        mensaje="Usuario agregado correctamente"       
        
    except Exception as error:
        mensaje=str(error) 
        
    return {"estado":estado, "mensaje":mensaje}


@app.route("/home/")
def home():
    if("user" in session):
        return render_template("contenido.html")
    else:
        mensaje="Debe primero ingresar con credenciales válidas"
        return render_template("frmIniciarSesion.html", mensaje=mensaje)

@app.route("/salir/")
def exit():
    session.clear()
    mensaje="Ha cerrado la sesión de forma"
    return render_template("frmIniciarSesion.html",mensaje=mensaje)