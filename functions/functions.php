<?php

function spanishMonth($month_number)
{
    $spanish_months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    for ($i = 0; $i < count($spanish_months); $i++) {
        if ($month_number == $i + 1) {
            $spanish_month = $spanish_months[$i];
            return $spanish_month;
        }
    }
}
