import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
)
import { LinkIcon, CogIcon, TrashIcon } from "@heroicons/react/24/solid";
import Modal from "./Modal";
import Link from "next/link";

const Dashboard = ({ user }) => {
    const baseUrl = process.env.NEXT_PUBLIC_HOST_URL
    const [urls, setUrls] = useState([]);
    const [openTab, setOpenTab] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUrl, setEditingUrl] = useState(null);



    useEffect(() => {
        const fetchUrls = async () => {
            const { data } = await supabase
                .from('urls')
                .select('*')
                .eq('user_id', user.id);
            setUrls(data);
        };

        fetchUrls();
    }, [user]);

    const handleEditClick = (url) => {
        setEditingUrl(url);
        setIsModalOpen(true);
    };

    const handleModalClose = (updatedUrl) => {
        if (updatedUrl) {
            setUrls(urls.map(url => url.id === updatedUrl.id ? updatedUrl : url));
        }
        setIsModalOpen(false);
        setEditingUrl(null);
    };

    const handleDelete = async (id) => {
        await supabase
            .from('urls')
            .delete()
            .eq('id', id);
        fetchUrls();
    };

    const data = {
        labels: urls?.map(url => url.short_uri),
        datasets: [
            {
                label: 'Visits',
                data: urls.map(url => url.count),
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
            },
        ],
    };

    const options = {
        indexAxis: 'y',
        elements: {
            bar: {
                borderWidth: 2,
            },
        },
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
            },
            title: {
                display: true,
                text: 'Visits by Short URL',
            },
        },
    };

    return (
        <div className="flex flex-wrap">
            <div className="w-full">
                <ul
                    className="flex mb-0 list-none flex-wrap pt-3 pb-4 flex-row"
                    role="tablist"
                >
                    <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
                        <a
                            className={
                                "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " +
                                (openTab === 1
                                    ? "text-black bg-blueGray-600"
                                    : "text-blueGray-600 bg-white")
                            }
                            onClick={e => {
                                e.preventDefault();
                                setOpenTab(1);
                            }}
                            data-toggle="tab"
                            href="#link1"
                            role="tablist"
                        >
                            URLs
                        </a>
                    </li>
                    <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
                        <a
                            className={
                                "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " +
                                (openTab === 2
                                    ? "text-black bg-blueGray-600"
                                    : "text-blueGray-600 bg-white")
                            }
                            onClick={e => {
                                e.preventDefault();
                                setOpenTab(2);
                            }}
                            data-toggle="tab"
                            href="#link2"
                            role="tablist"
                        >
                            Chart
                        </a>
                    </li>
                </ul>
                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
                    <div className="px-4 py-5 flex-auto">
                        <div className="tab-content tab-space">
                            <div className={openTab === 1 ? "block" : "hidden"} id="link1">
                                <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                    {urls.map((url) => (
                                        <li key={url.id} className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow">
                                            <div className="flex w-full items-center justify-between space-x-6 p-6">
                                                <div className="flex-1 truncate">
                                                    <div className="flex items-center space-x-3">
                                                        <h3 className="truncate text-sm font-medium text-gray-900">Short Url: {baseUrl + url.short_uri}</h3>
                                                    </div>
                                                    <div className="flex items-center space-x-3">
                                                        <h3 className="truncate text-sm font-medium text-gray-900">{url.msg_uri ? `Encrypted Message` : `Long Url: ${url.long_url}`}</h3>
                                                    </div>
                                                    <p className="mt-1 truncate text-sm text-gray-500">{url.count !== 1 ? `${url.count} visits` : `${url.count} visit` }</p>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="-mt-px flex divide-x divide-gray-200">
                                                    <div className="flex w-0 flex-1">
                                                        <Link
                                                            href={url.long_url}
                                                            className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
                                                            target="_blank"
                                                        >
                                                            <LinkIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                                            Goto destination
                                                        </Link>
                                                    </div>
                                                    <div className="-ml-px flex w-0 flex-1">
                                                        <button
                                                            onClick={() => handleEditClick(url)}
                                                            className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
                                                        >
                                                            <CogIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                                            Edit
                                                        </button>
                                                    </div>
                                                    <div className="-ml-px flex w-0 flex-1">
                                                        <button
                                                            onClick={() => handleDelete(url.id)}
                                                            className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
                                                        >
                                                            <TrashIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                                {isModalOpen && (
                                    <Modal url={editingUrl} onClose={handleModalClose} />
                                )}
                            </div>
                            <div className={openTab === 2 ? "block" : "hidden"} id="link2">
                                <div className="w-full">
                                    <Bar className="w-auto" options={options} data={data} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default Dashboard;
