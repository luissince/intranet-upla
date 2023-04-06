import { useEffect, useRef, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { SoporteListarConsultasRest } from "../../../../network/rest/index.network";
import ListarConsulta from "../../../../model/interfaces/soporte/listarconsulta.model.interfaces";
import RestError from "../../../../model/class/resterror.model.class";
import Response from "../../../../model/class/response.model.class";
import { Types } from "../../../../model/enum/types.model";
import Paginacion from "../../../../component/Paginacion.component";
import Responde from "../../../../model/interfaces/soporte/responde.model.interface";
import { formatTime } from "../../../../helper/herramieta.helper";
import { LoaderSvg } from "../../../../component/Svg.component";



const Listar = (props: RouteComponentProps<{}>) => {

    const opcion = useRef<number>(0);
    const paginacion = useRef<number>(0);
    const restart = useRef<boolean>(false);
    const totalPaginacion = useRef<number>(0);
    const filasPorPagina = useRef<number>(10);
    const [buscar, setBuscar] = useState<string>("");
    const [lista, setLista] = useState<ListarConsulta[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const abortControllerTable = useRef(new AbortController());

    const loadInit = async () => {
        if (loading) return;

        paginacion.current = 1;
        restart.current = true;
        fillTable("");
        opcion.current = 0;
    }

    const onEvenBuscar = async (value: string) => {
        if (loading) return;

        if (value.trim().length === 0) return;

        paginacion.current = 1;
        restart.current = false;
        fillTable(value.trim());
        opcion.current = 1;

    }

    const paginacionTable = (listid: number) => {
        paginacion.current = listid;
        restart.current = false;
        onEventPaginacion();
    }

    const onEventPaginacion = () => {
        switch (opcion.current) {
            case 0:
                fillTable("");
                break;
            case 1:
                fillTable(buscar);
                break;

            default: fillTable("");
        }
    }

    const fillTable = async (buscar: string) => {
        setLoading(true);
        setLista([]);

        const data = {
            "buscar": buscar,
            "posPagina": ((paginacion.current - 1) * filasPorPagina.current),
            "filaPagina": filasPorPagina.current
        }

        const response = await SoporteListarConsultasRest<Responde>(data, abortControllerTable.current);

        if (response instanceof Response) {
            totalPaginacion.current = Math.ceil(response.data.total / filasPorPagina.current);
            setLista(response.data.resultado as ListarConsulta[])
            setLoading(false);
        }

        if (response instanceof RestError) {
            if (response.getType() === Types.CANCELED) return;

            setLista([]);
            setLoading(false);
        }
    }

    useEffect(() => {
        loadInit();

        ()=> abortControllerTable.current.abort();
    }, []);

    const onEventeResponder = (idConsulta: string) => {
        props.history.push({
            pathname: `${props.match.path}/responder`,
            state: {
                "idConsulta": idConsulta,
            //     "token": authentication.user.token
            }
        });
    }

    return (
        <>
            <div className="flex flex-wrap -mx-3">
                <div className="w-full max-w-full px-3 flex-0">
                    <div className="flex flex-col visible w-full h-auto min-w-0 p-4 break-words bg-white opacity-100 border rounded-md bg-clip-border">

                        <div className="flex items-start justify-between flex-col lg:flex-row">
                            <div>
                                <h5 className="mb-0 font-bold text-lg">Lista de consultas</h5>
                                <p className="">Se va listar todas las consultas de los alumnos para ser atendidas.</p>
                            </div>

                            <div className="my-3 flex items-center justify-start gap-x-3 gap-y-4 flex-col sm:flex-row">
                                <button
                                    type="button"
                                    aria-controls="address"
                                    next-form-btn=""
                                    className="w-full sm:w-auto text-sm font-semibold rounded-md bg-white text-gray-900 border px-3 py-2 hover:bg-upla-100 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-upla-100">
                                    <span className="mr-2">Cancelar</span>
                                    <i className="bi bi-x-circle"></i>
                                </button>
                                <button
                                    type="button"
                                    aria-controls="recargar"
                                    next-form-btn=""
                                    className="w-full sm:w-auto text-sm font-semibold rounded-md bg-white text-gray-900 border px-3 py-2 hover:bg-upla-100 hover:text-white  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-upla-100"
                                    onClick={loadInit}>
                                    <span className="mr-2">Recargar</span>
                                    <i className="bi bi-arrow-clockwise"></i>
                                </button>
                            </div>
                        </div>

                        <div className="flex-auto">
                            <div className="">
                                <label className="inline-block mb-2 ml-1 text-sm text-slate-700">Buscar:</label>
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="Ingrese los datos para filtrar..."
                                    className="text-sm block w-full appearance-none rounded-md border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:outline-none"
                                    value={buscar}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                        setBuscar(event.currentTarget.value);
                                        onEvenBuscar(event.currentTarget.value);
                                    }}
                                />
                            </div>


                            <div className="relative overflow-auto rounded-md my-6">
                                <table className="w-full text-gray-700 uppercase bg-upla-100 border">
                                    <thead className="align-bottom">
                                        <tr>
                                            <th className="px-6 py-2 font-bold text-center uppercase align-middle text-white text-xs w-[5%]">#</th>
                                            <th className="px-6 py-2 font-bold text-center uppercase align-middle text-white text-xs w-[15%]">Ticket</th>
                                            <th className="px-6 py-2 font-bold text-center uppercase align-middle text-white text-xs w-[15%]">Fecha y Hora</th>
                                            <th className="px-6 py-2 font-bold text-center uppercase align-middle text-white text-xs w-[20%]">Alumno</th>
                                            <th className="px-6 py-2 font-bold text-center uppercase align-middle text-white text-xs w-[25%]">Asunto</th>
                                            <th className="px-6 py-2 font-bold text-center uppercase align-middle text-white text-xs w-[10%]">Estado</th>
                                            <th className="px-6 py-2 font-bold text-center uppercase align-middle text-white text-xs w-[5%]">Responder</th>
                                            <th className="px-6 py-2 font-bold text-center uppercase align-middle text-white text-xs w-[5%]">Anular</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            loading ?
                                            <tr className="text-center bg-white border-b">
                                                <td colSpan={8} className="text-sm p-2 border-b border-solid">
                                                    <div className="flex items-center justify-center">
                                                        <LoaderSvg /> <span>Cargando datos...</span>
                                                    </div>
                                                </td>
                                            </tr>
                                            :
                                            lista.length == 0 ?
                                                (
                                                    <tr className="text-center bg-white border-b">
                                                        <td colSpan={8} className="text-sm p-2  border-b border-solid">No hay datos para mostrar.</td>
                                                    </tr>
                                                )
                                                :
                                                lista.map((item, index) => {

                                                    return (
                                                        <tr key={index} className="bg-white border-b">
                                                            <td className="text-sm p-2 text-center align-middle border-b border-solid whitespace-nowrap">{item.id}</td>
                                                            <td className="text-sm p-2 text-center align-middle border-b border-solid whitespace-nowrap">N° - {item.ticket}</td>
                                                            <td className="text-sm p-2 text-left align-middle border-b border-solid whitespace-nowrap">{item.fecha} <br />{formatTime(item.hora)}</td>
                                                            <td className="text-sm p-2 text-left align-middle border-b border-solid whitespace-nowrap">{item.est_Id + "- " + item.est_NumDoc}<br />{item.alumno}</td>
                                                            <td className="text-sm p-2 text-left align-middle border-b border-solid whitespace-nowrap">{item.asunto}</td>
                                                            <td className="text-sm p-2 text-left align-middle border-b border-solid whitespace-nowrap">{item.estado_descripcion}</td>
                                                            <td className="text-sm p-2 text-center align-middle border-b border-solid whitespace-nowrap">
                                                                <button
                                                                    className="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 rounded-md text-sm px-4 py-2"
                                                                    onClick={()=>onEventeResponder(item.idConsulta)}>
                                                                    <i className="bi bi-chat-left-text-fill text-sm"></i>
                                                                </button>
                                                            </td>
                                                            <td className="p-2 text-center align-middle border-b border-solid whitespace-nowrap">
                                                                <button className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300  rounded-md text-sm px-4 py-2"><i className="bi bi-trash text-sm"></i></button>
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                        }
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex items-center justify-between flex-col md:flex-row gap-y-4">
                                <div>
                                    <span className="text-sm font-normal text-gray-900 ">Mostrando <span className="font-semibold text-gray-900">{paginacion.current}-{totalPaginacion.current}</span> de <span className="font-semibold text-gray-900">{filasPorPagina.current} </span>filas </span>
                                </div>
                                <nav className="bg-white rounded-md">
                                    <ul className="flex">
                                        <Paginacion
                                            loading={loading}
                                            restart={restart.current}
                                            paginacion={paginacion.current}
                                            totalPaginacion={totalPaginacion.current}
                                            fillTable={paginacionTable}
                                        />
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Listar;