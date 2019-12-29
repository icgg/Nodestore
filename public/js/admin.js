const deleteProduct = (btn) => {

    const prodId = btn.parentNode.querySelector('[name=productId]').value;
    const csrf = btn.parentNode.querySelector('[name=_csrf]').value;
    const productElement = btn.closest('article'); //returns the closest element that matches the specifier

    fetch('/admin/product/' + prodId, { //fetch can both send and receive HTTP requests
        method: "DELETE",
        headers: {
            'csrf-token': csrf
        },
    })
    .then(result => {
        return result.json();
    })
    .then(data => {
        console.log(data);
        productElement.remove();
    })
    .catch(err => {
        console.log(err);
    })

    console.log('CLicked');

}