import React from 'react';
import Swal from 'sweetalert2';

const Notification = ({type}) => {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })
  
  return (
    <div>
    {
      Toast.fire({
        icon: 'success',
        title: 'Signed in successfully'
      })
    }
   </div>
  )
}

export default Notification;