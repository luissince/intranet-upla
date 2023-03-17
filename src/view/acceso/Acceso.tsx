import React, { useRef, useState } from "react";
import { Redirect, RouteComponentProps } from 'react-router-dom';
import { motion } from "framer-motion";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from "../../store/store";
import { images } from "../../helper";
import { AcedemicCapSvg } from "../../component/svg/Svg";
import { login } from "../../store/authSlice"; 
import Button from "./widget/Button";
import InputPassword from "./widget/InputPassword";
import InputClave from "./widget/InputClave";
import Checked from "./widget/Checked";

const Acceso = (props: RouteComponentProps<{}>) => {

    const dispatch = useDispatch();
    const autenticado = useSelector((state: RootState) => state.autenticacion.autenticado)

    const [codigo, setCodigo] = useState<string>('');
    const [clave, setClave] = useState<string>('');
    const [mensaje, setMensaje] = useState<string>('');
    const [proceso, setProceso] = useState<boolean>(false);

    const [ver, setVer] = useState<boolean>(false);

    const [codigoMensaje, setCodigoMensaje] = useState<string>('');
    const [claveMensaje, setClaveMensaje] = useState<string>('');

    const refCodigo = useRef<HTMLInputElement>(null);
    const refClave = useRef<HTMLInputElement>(null);

    const onEventAcceso = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (proceso) return;

        setCodigoMensaje("");
        setClaveMensaje("");

        if (codigo == "") {
            refCodigo.current!.focus();
            setCodigoMensaje("!El campo es oblogatorio¡");
            return;
        }

        if (clave == "") {
            refClave.current!.focus();
            setClaveMensaje("!El campo es oblogatorio¡");
            return;
        }

        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }

        setProceso(true);

        await new Promise((resolve) => {
            setTimeout(resolve, 3000);
        });

        const data = {
            "codigo": codigo,
            "password": clave,
            "token": "qwe1qwe-266q6we2-wqweqw"
        };

        dispatch(login({ user: data }));

        setProceso(false);
    }

    const onEvenVerClave = () => {
        setVer(!ver);
        refClave.current?.focus();
    }

    if (autenticado) {
        return <Redirect to="/inicio" />
    }

    return <>
        <div className="flex flex-wrap w-screen h-screen">
            <div className="bg-portada relative -z-20 bg-cover hidden md:flex md:w-1/2 xl:w-2/3">
                <div className="bg-sombra w-full  h-screen absolute -z-10"></div>
                <div className="m-auto text-white text-center">
                    <motion.p
                        className="text-lg md:text-xl lg:text-3xl font-mont font-thin"
                        initial={{ x: -1000, opacity: 0 }}
                        transition={{ duration: 0.8 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ opacity: 0 }}>Bienvenidos al Sistema</motion.p>
                    <motion.h1 className="text-2xl md:text-4xl lg:text-6xl font-mont font-bold"
                        initial={{ x: -1000, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 1 }}
                    >INTRANET</motion.h1>
                    <motion.p
                        className="text-lg md:text-xl lg:text-2xl font-mont font-thin flex justify-center items-center"
                        initial={{ x: -1000, opacity: 0 }}
                        transition={{ duration: 0.8 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ opacity: 0 }}> <span className="px-1">(INT)</span> <AcedemicCapSvg size={"w-8 h-8"} /></motion.p>
                </div>
            </div>
            <div className="px-6 md:px-12 sm:px-10 my-auto w-full md:w-1/2 xl:w-1/3">
                <div className="shadow-lg border">
                    <motion.img
                        className="m-auto w-32 pt-4"
                        animate={{
                            scale: [1, 1.5, 1.5, 1, 1],
                            rotate: [0, 0, 270, 270, 0],
                            borderRadius: ["20%", "20%", "50%", "50%", "20%"],
                        }}
                        transition={{ duration: 2 }}
                        src={images.logo}
                        alt=""
                    />
                    <div className="flex flex-col items-center my-5">
                        <p className="font-mont text-center my-1">Por favor ingrese a su cuenta</p>
                        <p className="md:hidden text-center font-mont">SEGUIMIENTO DEL GRADUADO</p>
                        <p className="md:hidden text-center font-mont text-sm flex">
                            <span className="px-1">(SGD)</span> <AcedemicCapSvg />
                        </p>
                        <form className="w-full lg:px-12 md:px-8 px-4" onSubmit={onEventAcceso}>
                            <InputClave
                                refCodigo={refCodigo}
                                codigo={codigo}
                                codigoMensaje={codigoMensaje}
                                setCodigoMessage={setCodigoMensaje}
                                setCodigo={setCodigo}
                            />

                            <InputPassword
                                see={ver}
                                refClave={refClave}
                                clave={clave}
                                setClaveMensaje={setClaveMensaje}
                                setClave={setClave}
                                onEvenVerClave={onEvenVerClave}
                                claveMensaje={claveMensaje}
                            />

                            <Checked />

                            <Button proceso={proceso} />
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </>
}

export default Acceso;