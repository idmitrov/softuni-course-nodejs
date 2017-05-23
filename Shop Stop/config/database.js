let products = [],
    count = 1;

module.exports = {
    products: {
        getAll: () => {
            return products;
        },
        add: (product) => {
            count++;
            product.id = count; 
            products.push(product);
        },
        findByName: (name) => {
            let productToReturn = null;

            for (let product of products) {
                if (product.name === name) {
                    productToReturn = product;
                }
            }

            return productToReturn;
        }
    }
};