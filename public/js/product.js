const deleteProduct = (btn) => {
  const product = btn.parentNode.parentNode;
  const productId = product.querySelector("input[name=id]").value;

  fetch(`/admin/product/${productId}`, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      product.remove();
    })
    .catch((err) => {
      console.log(err);
    });
};
