(
  async function ()
  {
    "use strict";

    let forms = document.querySelectorAll('.php-email-form');
    console.log('6. forms: ', forms);
    forms.forEach(function (e)
    {
      e.addEventListener('submit', function (event)
      {
        event.preventDefault();

        let thisForm = this;

        let action = thisForm.getAttribute('action');
        console.log('17. action: ', action);
        let recaptcha = thisForm.getAttribute('data-recaptcha-site-key');
        console.log('19. recaptcha: ', recaptcha);

        if (!action)
        {
          displayError(thisForm, 'The form action property is not set!')
          return;
        }
        thisForm.querySelector('.loading').classList.add('d-block');
        alert('Your message has been sent. Thank you!')
        location.reload();
        thisForm.querySelector('.loading').classList.remove('d-block');
        thisForm.querySelector('.error-message').classList.remove('d-block');
        thisForm.querySelector('.sent-message').classList.remove('d-block');

        let formData = new FormData(thisForm);
        console.log('31. formData: ', formData);
        if (recaptcha)
        {
          if (typeof grecaptcha !== "undefined")
          {
            grecaptcha.ready(function ()
            {
              try
              {
                grecaptcha.execute(recaptcha, { action: 'php_email_form_submit' })
                  .then(token =>
                  {
                    formData.set('recaptcha-response', token);
                    php_email_form_submit(thisForm, action, formData);
                  })
              } catch (error)
              {
                displayError(thisForm, error)
              }
            });
          } else
          {
            displayError(thisForm, 'The reCaptcha javascript API url is not loaded!')
          }
        } else
        {
          php_email_form_submit(thisForm, action, formData);
        }
      });
    });

    async function php_email_form_submit (thisForm, action, formData)
    {
      let res = await fetch(`${ action }`);
      let data = await res.json();
      console.log('65. data:' + data);


      // fetch(action, {
      //   method: 'POST',
      //   body: formData,
      //   headers: { 'X-Requested-With': 'XMLHttpRequest' }
      // })
      //   .then(response =>
      //   {
      //     console.log('70. response: ' + response);
      //     if (response.ok)
      //     {
      //       return response.text()
      //     } else
      //     {
      //       console.log('error here line 75');
      //       throw new Error(`${ response.status } ${ response.statusText } ${ response.url }`);
      //     }
      //   })
      //   .then(data =>
      //   {
      //     thisForm.querySelector('.loading').classList.remove('d-block');
      //     if (data.trim() == 'OK')
      //     {
      //       thisForm.querySelector('.sent-message').classList.add('d-block');
      //       thisForm.reset();
      //     } else
      //     {
      //       throw new Error(data ? data : 'Form submission failed and no error message returned from: ' + action);
      //     }
      //   })
      //   .catch((error) =>
      //   {
      //     displayError(thisForm, error);
      //   });
    }

    function displayError (thisForm, error)
    {
      thisForm.querySelector('.loading').classList.remove('d-block');
      thisForm.querySelector('.error-message').innerHTML = error;
      thisForm.querySelector('.error-message').classList.add('d-block');
    }

  })();
