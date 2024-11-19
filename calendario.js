const calendarElement = document.getElementById('calendar');
const bookingForm = document.getElementById('booking-form');
const dateInput = document.getElementById('date');
const confirmationMessage = document.getElementById('confirmation');

let selectedDate = null; // Variable para almacenar la fecha seleccionada
let selectedHour = null; // Variable para almacenar la hora seleccionada
const currentDate = new Date();
let actualMonth = currentDate.getMonth();
let actualYear = currentDate.getFullYear();
const arrayReservedDates = []

//guardar la reserva en localsession
function saveBooking() {
    const name = document.getElementById('name').value;
    const date = selectedDate.toLocaleDateString();
    const time = document.getElementById('time-slots').value;
    const booking = { name, date, time };
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    bookings.push(booking);
    localStorage.setItem('bookings', JSON.stringify(bookings));
}

//cargar la reserva en localsession
function loadBookings() {
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    const bookingList = document.getElementById('booking-list');
    bookingList.innerHTML = '';
    bookings.forEach((booking, index) => {
        const bookingElement = document.createElement('li');
        bookingElement.textContent = `${booking.name} - ${booking.date} - ${booking.time}`;
        bookingList.appendChild(bookingElement);
    }
    );
}


function removeAllSelected() {
    const selectedElements = document.querySelector('.selected');
    if (selectedElements) {
        selectedElements.classList.remove('selected');
    }
}

function generateTimeSlots() {
    const timeSlots = document.getElementById('time-slots');
    timeSlots.innerHTML = ''; // Limpiar las opciones anteriores

    const defaultOption = document.createElement('div');
    defaultOption.textContent = 'Fecha seleccionada ' + selectedDate.toLocaleDateString();
    defaultOption.classList.add('default-option');
    timeSlots.appendChild(defaultOption);

    for (let i = 9; i <= 18; i++) {
        const timeSlot = document.createElement('div');
        timeSlot.textContent = `${i}:00`;
        timeSlot.classList.add('time-slot');
        // Marcar las 9:00 como reservada
        if (i === 9) {
            timeSlot.classList.add('reserved');
        } else if(selectedDate.getDate() === currentDate.getDate() && i <= currentDate.getHours()) {
            timeSlot.classList.add('reserved');
        } else {

            timeSlot.addEventListener('click', function() {
                selectTimeSlot(i);
            });
        }
        timeSlots.appendChild(timeSlot);
    }
    // Mostrar el modal
    const modal = document.getElementById('timeSlotsModal');
    modal.style.display = 'block';

    // Cerrar el modal cuando se hace clic en el botón de cerrar
    const closeModal = document.getElementsByClassName('close')[0];
    closeModal.onclick = function() {
        modal.style.display = 'none';
    }

    // Cerrar el modal cuando se hace clic fuera del contenido del modal
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
}

function selectTimeSlot(hour) {
    selectedHour = hour;
    const timeSlots = document.querySelectorAll('.time-slot');
    timeSlots[hour - 9].classList.add('selected');
    dateInput.value = selectedDate.toLocaleDateString() + ' ' + selectedHour + ':00';
    const modal = document.getElementById('timeSlotsModal');
    modal.style.display = 'none';
    const button = document.getElementById('btn-reservar');
    button.classList.remove('disabled');
}




function generateCalendar(year,month) {
    const currentDate = new Date();
    if (year === undefined) {
        year = currentDate.getFullYear();
    }
    if (month === undefined) {
        month = currentDate.getMonth();  
    }

    goFirstDayOfTheMonth(year, month);


    const monthString = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const nameMonth = monthString[month];
        document.getElementById('month-year').textContent = nameMonth + ' ' + year;
    const lastDay = new Date(year, month + 1, 0);
    for (let i = 1; i <= lastDay.getDate(); i++) {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('day');
        dayDiv.textContent = i;

        const dayDate = new Date(year, month, i);
        const today = new Date();
        
        if (dayDate.getDate() < today.getDate() ) {
            dayDiv.style.backgroundColor = '#f0f0f0'; // Día pasado
            dayDiv.style.cursor = 'not-allowed'; // Desactivar el clic
            dayDiv.onclick = null; // Desactivar el clic
            dayDiv.style.textDecoration = 'line-through'; // Tachado
            dayDiv.style.color = '#aaa'; // Color gris para los días pasados
        } else if(dayDate.getDay() === 0 || dayDate.getDay() === 6) {
            dayDiv.style.backgroundColor = '#BCBCBC'; // Día festivo
            dayDiv.style.cursor = 'not-allowed'; // Desactivar el clic
            dayDiv.onclick = null; // Desactivar el clic
            dayDiv.style.color = '#aaa'; // Color gris para los días festivos
        } else {
            dayDiv.addEventListener('click', (event) => selectDate(event,i));
        }

        calendarElement.appendChild(dayDiv);
    }

    if(selectedDate) {
        const selectedDay = selectedDate.getDate();
        const selectedMonth = selectedDate.getMonth();
        const selectedYear = selectedDate.getFullYear();
        if (selectedMonth === month && selectedYear === year) {
            const days = document.querySelectorAll('.day');
            days[selectedDay - 1].classList.add('selected');
        }
    }


}

function selectDate(event, day) {
    const currentDate = new Date();
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    selectedDate = new Date(year, month, day); // Almacenar la fecha seleccionada

    removeAllSelected();

    // Cambiar el color de fondo del elemento seleccionado
    event.target.classList.add('selected');

    //dateInput.value = selectedDate.toLocaleDateString();
    // Generar los horarios disponibles
    generateTimeSlots(selectedDate);
    
}

document.getElementById('reserveForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevenir el comportamiento por defecto del formulario
    
    if (!selectedDate) {
        alert('Por favor, selecciona una fecha antes de reservar.'); // Mensaje de advertencia si no hay fecha seleccionada
        return;
    }

    const name = document.getElementById('name').value;
    const date = selectedDate.toLocaleDateString();

    confirmationMessage.textContent = `Reserva realizada para ${name} el ${date} a las ${selectedHour}:00.`;
    confirmationMessage.classList.remove('hidden'); // Mostrar el mensaje de confirmación
});

function goFirstDayOfTheMonth( year, month) {
    let firstDay = new Date(year, month, 1).getDay();
    const calendar = document.getElementById('calendar');

    // Ajustar para que el lunes sea el primer día (0 = Lunes, 6 = Domingo)
    firstDay = (firstDay === 0) ? 6 : firstDay - 1;

    // Agregar divs vacíos hasta llegar al primer día del mes
    for (let i = 0; i < firstDay; i++) {
        const emptyDiv = document.createElement('div');
        emptyDiv.classList.add('empty');
        calendar.appendChild(emptyDiv);
    }
    
}

document.getElementById('prev-month').addEventListener('click', function () {
    calendarElement.innerHTML = '';
    // Calcular el mes y año anterior

    if (actualMonth === 0) {
        actualMonth = 11;
        actualYear -= 1;
    } else {
        actualMonth -= 1;
    }
    generateCalendar(actualYear, actualMonth);
   
});

document.getElementById('next-month').addEventListener('click', function () {
    calendarElement.innerHTML = '';
     // Calcular el mes y año anterior
     if (actualMonth === 11) {
        actualMonth = 0;
        actualYear += 1;
    } else {
        actualMonth += 1;
    }
    generateCalendar(actualYear, actualMonth);
}
);

generateCalendar(actualYear, actualMonth); // Generar el calendario del mes actual
