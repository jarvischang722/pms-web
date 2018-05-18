import VeeValidate from 'vee-validate';

const dictionary = {
    en: {
        messages: {
            email: "email en error"
        }
    },
    tw: {
        messages: {
            email: "email error"
        }
    }
};

Vue.use(VeeValidate, {
    locale: 'en',
    dictionary: dictionary
});

this.$validator.validate().then(result => {
    if (!result) {
        // do stuff if not valid.
        alert(this.$validator.errors.items[0].msg);
    }
    else {

    }
});