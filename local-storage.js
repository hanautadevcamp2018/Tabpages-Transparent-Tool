console.log("I am local-storage.js");
(function() {

    function LocalStorage() {

        function getFromLocalStorage(key, defaultValue) {

            defaultValue = defaultValue || null;

            try {
                return JSON.parse(localStorage.getItem(key)) || defaultValue;
            } catch (e) {
                console.warn('Could not parse data from local storage!');
                return defaultValue;
            }
        }

        function setToLocalStorage(key, value) {
            var dataString = JSON.stringify(value);
            localStorage.setItem(key, dataString);
        }

        return {
            set: setToLocalStorage,
            get: getFromLocalStorage
        }
    }
    window.LocalStorage = LocalStorage();

})(window);
