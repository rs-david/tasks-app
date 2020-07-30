<?php

/* Archivos */
function almacenarArchivo($name)
{
    $temporal_name = $_FILES["$name"]['tmp_name'];
    $name = $_FILES["$name"]['name'];
    $url = "files/$name";

    move_uploaded_file($temporal_name, "$url");

    return $url;
}

/* Sesiones */
function filtrarDatos($datos)
{
    $data = trim($datos);
    $data = htmlspecialchars($data);

    return $data;
}

function verificarUsuario($conexion, $usuario)
{
    $exists = $conexion->prepare('SELECT user FROM users WHERE user=:user');
    $exists->execute([':user' => $usuario]);
    $exists = $exists->fetch();

    return $exists == false ? false : true;
}

function obtenerClaveDeUsuario($conexion, $usuario)
{
    $user_id = $conexion->prepare('SELECT id FROM users WHERE user=:user');
    $user_id->execute([':user' => $usuario]);
    $user_id = $user_id->fetch();
    $user_id = $user_id["id"] ?? false;

    return $user_id;
}

function verificarEmail($conexion, $correo)
{
    $exists = $conexion->prepare('SELECT email FROM users WHERE email=:email');
    $exists->execute([':email' => $correo]);
    $exists = $exists->fetch();

    return $exists == false ? false : true;
}

function verificarContraseña($conexion, $usuario, $password)
{
    $hash = $conexion->prepare('SELECT password FROM users WHERE user=:user');
    $hash->execute([':user' => $usuario]);
    $hash = $hash->fetch();
    $hash = $hash['password'];

    $correct = password_verify($password, $hash);
    return $correct;
}

function registrarUsuario($conexion, $usuario, $correo, $contrasena)
{
    $hash = password_hash($contrasena, PASSWORD_BCRYPT);

    $register = $conexion->prepare('INSERT INTO users(user, email, password) VALUES(:user, :email, :password)');
    $register->execute([':user' => $usuario, ':email' => $correo, ':password' => $hash]);

    return $register == false ? false : true;
}
