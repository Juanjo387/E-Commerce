/* eslint-disable no-undef */
import chai from "chai";
import chaiHttp from "chai-http";
import app from "../../app.js";  

chai.use(chaiHttp);
const { expect } = chai;

describe("Feature Testing", () => {

	it("Discount options are valid and correct points are increased after purchase", (done) => {
		const orderData = {
			  "_id": "66a8d69ad4a8d5c7ff08e3fe",
			  "username": "user",
			  "totalAmount": 1499,
			  "products": [
				{
				  "id": "66a8cf901c7e44c094c31fdb",
				  "sNo": 3,
				  "name": "Super 4k TV 1",
				  "price": 1499
				}
			  ],
			  "address": "",
			  "payment": {
				"cardNumber": "1234567887654321",
				"expiryDate": "05/25",
				"cvv": "123"
			  }
		}
		

		const discountData = [
            {
              "points": 20,
              "discount": 10
            },
            {
              "points": 40,
              "discount": 15
            },
            {
              "points": 60,
              "discount": 20
            },
            {
              "points": 80,
              "discount": 25
            }
        ];

		chai.request(app)
			.get("/api/discount/options")
			.end((err, res) => {
				expect(res).to.have.status(200);
				expect(res.body).to.deep.equal(discountData);
				chai.request(app)
					.post("/api/orders/")
					.send(orderData)
					.end((err, res) => {
						chai.request(app)
						.get("/api/discount/points")
						.end((err, res) => {
							expect(res).to.have.status(200);
							expect(res.body).to.have.property("points").to.equal(37);
							done();
						});
					});
				
			});
	});

	it("Apply discount points is handled correctly", (done) => {
		const orderData = {
				"_id": "66a8ebc5031bb53de4843d36",
				"username": "user",
				"totalAmount": 999,
				"products": [
				  {
					"id": "66a8cf901c7e44c094c31fd9",
					"sNo": 1,
					"name": "myPhone",
					"price": 999
				  }
				],
				"address": "",
				"payment": {
				  "cardNumber": "1234567812345678",
				  "expiryDate": "05/25",
				  "cvv": "123"
				}
		}
		

		chai.request(app)
			.post("/api/orders/")
			.send(orderData)
			.end((err, res) => {
				chai.request(app)
				.get("/api/discount/points")
				.end((err, res) => {
					expect(res).to.have.status(200);
					expect(res.body).to.have.property("points").to.equal(61);
					chai.request(app)
					.post("/api/discount/apply")
					.send({
						"discount": 20
					})
					.end((err, res) => {
						expect(res).to.have.status(200);
						expect(res.body).to.have.property("discount").to.equal(20);
						expect(res.body).to.have.property("updatedPoints").to.equal(1);
						done();
					});
				});
			});
	});
});
