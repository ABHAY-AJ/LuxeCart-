import { useDispatch } from "react-redux";
import React from "react";
import { useEffect } from "react";
import{Button, Form, Input, message} from "antd";
import { Link , useNavigate} from "react-router-dom";
import FormItem from "antd/es/form/FormItem";
import Divider from "../../components/Divider";
import {RegisterUser} from "../../apicalls/users";
import { SetLoader } from "../../redux/loadersSlice";


const rules = [
    {
        required: true,
        message: "required"
    }
];

function Register(){

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const onFinish= async(values) => {
        try{
            dispatch(SetLoader(true))
            const response = await RegisterUser(values);
            dispatch(SetLoader(false))
            if(response.success){
                navigate("/");
                message.success(response.message);
            }else{
                throw new Error(response.message);
            }
        }catch (error){
            dispatch(SetLoader(false))
            message.error(error.message);
        }
    };

    useEffect(()=>{
        if(localStorage.getItem("token")){
            navigate("/")
        }
    },[]);

    return(
        <div className="h-screen  flex justify-center items-center bg-primary-gradient">
            <div className=" p-5 rounded w-[450px] bg-slate-300" >
                <h1 className="text-primary text-2xl">
                    LuxeCart - <span className="text-gray-400 text-2xl">Register</span>
                </h1>
                <Divider/>
                <Form layout="vertical"
                onFinish={onFinish}
                >
                    <Form.Item label="Name" name="name" rules={rules}>
                        <Input placeholder="Name" />
                    </Form.Item>
                    <FormItem label="Email" name="email" rules={rules}>
                        <Input placeholder="Email" />
                    </FormItem>
                    <Form.Item label="Password" name="password" rules={rules}>
                        <Input
                        type="password"
                        placeholder="password" />
                    </Form.Item>

                    <Button type="primary" htmlType="submit" className="mt-2 bg-blue-950" block>
                        Register
                    </Button>

                    <div className="mt-5 text-center">
                    <span className="text-gray-500">
                        Already have an account? <Link
                        className="text-primary"
                        to="/login">Login</Link>
                    </span>
                    </div>
                   
                </Form>
            </div>
        </div>
    )
}

export default Register;