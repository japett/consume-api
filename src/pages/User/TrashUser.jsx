import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Case from "../../components/Case";
import { MdArrowBack, MdRestore, MdDeleteForever } from "react-icons/md";
import Swal from 'sweetalert2';

export default function Trash() {
    const [trash, setTrash] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const accessToken = localStorage.getItem('access_token');
        const config = {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        };

        axios.get('http://localhost:8000/user/trash', config)
        .then(res => {
            setTrash(res.data.data);
        })
        .catch(err => {
            console.log(err);
            if (err.response.status === 401) {
                navigate('/login?message=' + encodeURIComponent('Anda belum login'));
            } else {
                setError('Terjadi kesalahan saat memuat data sampah.');
            }
        });
    }, []);

    const restoreUser = (id) => {
        Swal.fire({
            title: 'Apakah Anda yakin ingin mengembalikan barang ini?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, kembalikan!',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                const accessToken = localStorage.getItem('access_token');
                const config = {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                };

                axios.put(`http://localhost:8000/user/restore/${id}`, null, config)
                .then(() => {   
                    setTrash(trash.filter(user => user.id !== id));
                    Swal.fire(
                        'Berhasil!',
                        'Barang telah berhasil dikembalikan.',
                        'success'
                    );
                })
                .catch(err => {
                    setError('Gagal mengembalikan barang.');
                });
            }
        });
    };

    const permanentDeleteUser = (id) => {
        Swal.fire({
            title: 'Apakah Anda yakin ingin menghapus barang ini secara permanen?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                const accessToken = localStorage.getItem('access_token');
                const config = {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                };

                axios.delete(`http://localhost:8000/user/permanentDel/${id}`, config)
                .then(() => {
                    setTrash(trash.filter(user => user.id !== id));
                    Swal.fire(
                        'Berhasil!',
                        'Barang telah berhasil dihapus secara permanen.',
                        'success'
                    );
                })
                .catch(err => {
                    setError('Gagal menghapus barang secara permanen.');
                });
            }
        });
    };

    return (
        <Case>
            <div className="block w-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <div className="m-5 pb-10 pt-10">
                    <div className="flex justify-between">
                        <h5 className="mb-1 ml-5 text-3xl font-medium text-white">User Trash</h5>
                        <div className="flex">
                            <button className="px-4 py-2 bg-teal-700 text-white shadow-md border-sky-500 rounded-lg mr-2">
                                <Link to="/user">
                                    <MdArrowBack className="w-6 h-6 text-white" />
                                </Link>
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div role="alert">
                            <div className="bg-red-500 text-white font-bold rounded-t px-4 py-2">
                                Gagal!
                            </div>
                            <div className="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
                                {error}
                            </div>
                        </div>
                    )}

                    <div className="overflow-x-auto">
                        <table className="w-full table-auto">
                            <thead>
                                <tr>
                                    <th className="border px-4 py-2 text-white">Username</th>
                                    <th className="border px-4 py-2 text-white">Email</th>
                                    <th className="border px-4 py-2 text-white">Password</th>
                                    <th className="border px-4 py-2 text-white">Role</th>
                                    <th className="border px-4 py-2 text-white">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {trash.map(user => (
                                    <tr key={user.id}>
                                        <td className="border px-4 py-2 text-white">{user.username}</td>
                                        <td className="border px-4 py-2 text-white">{user.email}</td>
                                        <td className="border px-4 py-2 text-white">{user.password}</td>
                                        <td className="border px-4 py-2 text-white">{user.role}</td>
                                        <td className="border px-4 py-2 text-white">
                                            <button className="mr-2 text-green-500 hover:text-green-700" onClick={() => restoreUser(user.id)}>
                                                <MdRestore className="w-6 h-6" />
                                            </button>
                                            <button className="text-red-500 hover:text-red-700" onClick={() => permanentDeleteUser(user.id)}>
                                                <MdDeleteForever className="w-6 h-6" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Case>
    );
}
