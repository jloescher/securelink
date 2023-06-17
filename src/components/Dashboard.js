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
import Modal from "./Modal";

const Dashboard = ({ user, scrollableHeight }) => {
    const [urls, setUrls] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUrl, setEditingUrl] = useState(null);

    const fetchUrls = async () => {
        const { data } = await supabase
            .from('urls')
            .select('*')
            .eq('user_id', user.id);
        setUrls(data);
    };

    useEffect(() => {
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
        <div className="flex flex-row h-screen p-4">
            <ul className="overflow-scroll w-[20vw]" style={{ height: scrollableHeight }}>
                {urls.map(url => (
                    <li key={url.id} className="flex justify-between my-2">
                        <div>
                            <a href={url.long_url} target="_blank">{url.short_uri}</a> - {url.count} visits
                        </div>
                        <div>
                            <button
                                className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                                onClick={() => handleEditClick(url)}
                            >
                                Edit
                            </button>
                            <button onClick={() => handleDelete(url.id)} className="bg-red-500 text-white px-2 py-1 rounded">
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
            {isModalOpen && (
                <Modal url={editingUrl} onClose={handleModalClose} />
            )}
            <div className="w-[80vw]">
                <Bar className="w-auto" options={options} data={data} />
            </div>
        </div>
    );
};

export default Dashboard;
