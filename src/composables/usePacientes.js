import api from 'src/services/api';

export function usePaciente() {

    const createPaciente = async (paciente) => {
        try {
            const response = await api.post(`/paciente`, paciente)
            return { success: true, data: response.data, message: 'Paciente cadastrado com sucesso!' }
        } catch (error) {
            console.error('Erro ao cadastrar o Usuário:', error);
            return { success: false, message: error };
        }
    }

    const findPacientes = async () => {
        try {
            const response = await api.get('/paciente')
            return { success: true, data: response.data }
        } catch (error) {
            console.error('Erro ao buscar o Usuários:', error);
            return { success: false, message: error };
        }
    }
    const findPaciente = async (id) => {
        try {
            const response = await api.get(`/paciente/${id}`)
            return { success: true, data: response.data }
        } catch (error) {
            console.error('Erro ao buscar o Usuário:', error);
            return { success: false, message: error };
        }
    }

    const updatePaciente = async (id, paciente) => {
        try {
            const response = await api.put(`/paciente/${id}`, paciente)
            return { success: true, data: response.data, message: 'Paciente  com sucesso!' }
        } catch (error) {
            console.error('Erro ao alterar o Usuário:', error);
            return { success: false, message: error };
        }
    }

    return {
        createPaciente,
        findPacientes,
        findPaciente,
        updatePaciente
    }
}