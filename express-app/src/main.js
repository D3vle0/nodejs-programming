//@ts-check //js에서 의미검사 사용

const express = require("express");
const app = express();
const port = 3000;

const userRouter = express.Router();

userRouter.get("/", (req, res) => {
    res.send("userlist")
});

const USERS = {
    3321: {
        nickname: "internet explorer"
    }
}

userRouter.param("id", (req, res, next, value) => {
    console.log(value);
    //@ts-ignore
    req.user = USERS[value];
    next();
});

userRouter.get("/:id", (req, res) => {
    console.log("userRouter가 ID를 캐치함");
    //@ts-ignore
    res.send(req.user);
});

userRouter.post("/", (req, res) => {
    res.send("userlist가 post 방식으로 호출됨");
});

app.use("/users", userRouter);

app.use("/post", (req, res) => {
    res.send("<form action='/users' method='post'><input type='submit'></form>")
});

app.listen(port, () => console.log(`http://localhost:${port}`));