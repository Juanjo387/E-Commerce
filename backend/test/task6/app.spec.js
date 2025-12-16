/* eslint-disable no-undef */
import chai from "chai";
import chaiHttp from "chai-http";
import app from "../../app.js";  

chai.use(chaiHttp);
const { expect } = chai;

describe("Feature Testing", () => {

	it("should successfully edit a product and return 200 status code", (done) => {
		const productData = {
			name: "myPhone",
			price: 99,
			description: "The latest phone with advanced features",
			tags: ["electronics", "smartphone", "mobile"],
		};
		
		let id = "";
		chai.request(app)
			.get("/api/products")
			.end((err, res) => {
				id = res.body[0]._id;
        
				chai.request(app)
					.put(`/api/products/${id}`) 
					.send(productData)
					.end((err, res) => {
						expect(res).to.have.status(200);
						expect(res.body).to.not.be.empty;
						expect(res.body).to.have.property("acknowledged").to.equal(true);
						done(); 
					});
			});  
	});
});
