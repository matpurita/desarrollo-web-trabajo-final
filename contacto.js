//agregar jquery validator para los campos del formulario
$(document).ready(function() {
    $("#contactForm").validate({
        rules: {
            name: {
                required: true,
                minlength: 3
            },
            email: {
                required: true,
                email: true
            },
            message: {
                required: true,
                minlength: 10
            }
        },
        messages: {
            name: {
                required: "Por favor, ingrese su nombre",
                minlength: "El nombre debe tener al menos 3 caracteres"
            },
            email: {
                required: "Por favor, ingrese su email",
                email: "Por favor, ingrese un email válido"
            },
            message: {
                required: "Por favor, ingrese su mensaje",
                minlength: "El mensaje debe tener al menos 10 caracteres"
            }
        },
        submitHandler: function(form,event) {
            event.preventDefault();
            
            // Mostrar SweetAlert al enviar el formulario
            Swal.fire({
                title: '¡Formulario enviado!',
                text: 'Tu mensaje ha sido enviado con éxito.',
                icon: 'success',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#28a745',

            }).then((result) => {
                if (result.isConfirmed) {
                    form.reset();
                }
            });
            
        }
    });
});