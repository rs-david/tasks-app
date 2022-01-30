<?php

/* Funciones Para Trabajar Con Sesiones */
function filtrarDatos($datos)
{
    $data = trim($datos);
    $data = htmlspecialchars($data);

    return $data;
}

function verificarUsuario($conexion, $usuario)
{
    $user_exists = $conexion->prepare('SELECT user FROM users WHERE user=:user');
    $user_exists->execute([':user' => $usuario]);
    $user_exists = $user_exists->fetch();

    return $user_exists == false ? false : true;
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
    $email_exists = $conexion->prepare('SELECT email FROM users WHERE email=:email');
    $email_exists->execute([':email' => $correo]);
    $email_exists = $email_exists->fetch();

    return $email_exists == false ? false : true;
}

function verificarContraseña($conexion, $usuario, $password)
{
    $hash = $conexion->prepare('SELECT password FROM users WHERE user=:user');
    $hash->execute([':user' => $usuario]);
    $hash = $hash->fetch();
    $hash = $hash['password'];

    $correct_password = password_verify($password, $hash);
    return $correct_password;
}

function registrarUsuario($conexion, $usuario, $correo, $contrasena)
{
    $hash = password_hash($contrasena, PASSWORD_BCRYPT);

    $register = $conexion->prepare('INSERT INTO users(user, email, password) VALUES(:user, :email, :password)');
    $register->execute([':user' => $usuario, ':email' => $correo, ':password' => $hash]);

    return $register == false ? false : true;
}
