const cajero = [
	{denominacion: 1000, cantidad: 5},
	{denominacion: 500, cantidad: 5},
	{denominacion: 200, cantidad: 5},
	{denominacion: 100, cantidad: 10},
	{denominacion: 50, cantidad: 10},
];

const sumarDineroDisponible = () => {
	const total = cajero.reduce( (accum, denominacion) => {
		return accum += denominacion.cantidad * denominacion.denominacion
	}, 0 );

	return total;
}

const comprobarDisponibilidad = (cantidad) => {
	const disponible = sumarDineroDisponible();
	
	return disponible >= cantidad ? true : false;
}

const calcularDenominaciones = (cantidad) => {
	const denominacionesAEntregar = [];
	
	for( billete of cajero ) {
		const nBilletes = Math.floor(cantidad / billete.denominacion);

		if ( billete.cantidad == 0) continue;
        if( nBilletes > billete.cantidad ) {
          denominacionesAEntregar.push({
            denominacion: billete.denominacion,
            cantidad: billete.cantidad
          });
          cantidad -= billete.cantidad * billete.denominacion;
          billete.cantidad = 0;
        } else if (nBilletes > 0) {
          denominacionesAEntregar.push({
            denominacion: billete.denominacion,
            cantidad: nBilletes
          });
          cantidad -= nBilletes * billete.denominacion;
          billete.cantidad -= nBilletes;
        }
        if(cantidad == 0) break;
	}

	if (cantidad > 0 ) {
		for( const billete of cajero ){
			denominacionesAEntregar.forEach( denominacion => {
				if (denominacion.denominacion == billete.denominacion){
					billete.cantidad += denominacion.cantidad
				}
			})
		}
		return { error: true, message: "Ocurrio un error interno.\nNo pudimos entregar la cantidad solicitada."}
	}
	return denominacionesAEntregar;
}

const entregarDinero = (cantidad) => {
	const disponibilidad = comprobarDisponibilidad(cantidad);
	if ( disponibilidad ) {
		return calcularDenominaciones(cantidad);
	}
	return { error: true, message: "Sin fondos suficientes."}
}

// Seleccionar elementos del dom
const cajeroForm = document.querySelector("#cajero");
cajeroForm.addEventListener("submit", (e) => {
	e.preventDefault();
	const cantidad = e.target.querySelector("#cantidad").value;
	const divMessage = e.target.querySelector("#mensaje")

	if ( !cantidad || isNaN(cantidad) || cantidad == 0) {
		alert("No a ingresado una cantidad valida.")
	} else {
		const res = entregarDinero(parseInt(cantidad));
		if (res.error) { 
			divMessage.innerHTML = res.message;
		} else {
			const message = res.map( denominacion => (`<li>Denominacion: ${denominacion.denominacion}, cantidad: ${denominacion.cantidad}</li>`))
			divMessage.innerHTML = message.join('');
		}
		console.log(res);
	}
	console.log(typeof cantidad);
})