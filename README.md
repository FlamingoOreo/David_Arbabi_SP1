# David_Arbabi_SP1

In this project Bootstrap 5 along with jQuery was used to create the design and functionality of the website.
Additionally Sweetalerts2 was used. This external plugin was used to avoid using vanilla prompt() & alert(). The reasoning for this is to enhance user experience.
Vanilla prompts/alerts are not pleasing to the eye and doesn't allow for customization.

The SweetAlert2 alerts allow us to convey more information and capture specific data. 
We can instlal this by putting <script src="//cdn.jsdelivr.net/npm/sweetalert2@11"></script> into our HTML file.

The syntax is as following:
Swal.fire('hello')

This will send a basic alert with the message.

We can customize it further:

Swal.fire({
  icon: 'error',
  title: 'Oops...',
  text: 'Something went wrong!',
  footer: '<a href="">Why do I have this issue?</a>'
})

This will use the error icon from SweetAlerts, and setting the alert title to "Oops..." and the text to "Something went wrong!" Lastly we have a link in the footer of the alert. 

We can prompt the user with SweetAlert2 by doing:

Swal.fire({
            title: 'Hello there!',
            text: 'Please enter your name:',
            input: 'text',
            showCancelButton: true,
            confirmButtonText: 'Submit'
})

The input field will allow the user to enter a text, we are asking for their name here. We can do more validations with the input if needed. 

To conclude SweetAlert2 allows more flexibility in our alerts & prompts and further increases the user experience by having visually pleasing popups instead of the vanilla ones.


To run the application we need to open the wdt_app.html inside the web_application folder. This is a HTML file where we can see the application and the functionalities. We are able to change the staff member's status from In to Out and vice versa by the use of the buttons, we can then choose a time in the form of minutes. We are able to display toasts on staff members that have not returned yet on the specified time.

The delivery section allows us to add a delivery driver to the delivery board, we can schedule a Car or Motorcycle delivery and just like the staff members, we will be notified of any late deliveries with a toast notification. 
