import api from 'src/services/api';

export function useProfissionais() {

    const createProfissional = async (profissional) => {
        try {
            const response = await api.post(`/profissional`, profissional)
            return { success: true, data: response.data, message: 'Parofissional cadastrado com sucesso!' }
        } catch (error) {
            console.error('Erro ao cadastrar o Profissional:', error);
            return { success: false, message: error };
        }
    }

    const findProfissionais = async () => {
        try {
            const response = await api.get('/profissional')
            return { success: true, data: response.data }
        } catch (error) {
            console.error('Erro ao buscar o Usuários:', error);
            return { success: false, message: error };
        }
    }

    const findProfissional = async (id) => {
        try {
            const response = await api.get(`/profissional/${id}`)
            return { success: true, data: response.data }
        } catch (error) {
            console.error('Erro ao buscar o Profissional:', error);
            return { success: false, message: error };
        }
    }

    const updateProfissional = async (id, profissional) => {
        try {
            const response = await api.put(`/profissional/${id}`, profissional)
            return { success: true, data: response.data, message: 'Profissional  com sucesso!' }
        } catch (error) {
            console.error('Erro ao alterar o Profissional:', error);
            return { success: false, message: error };
        }
    }

    return {
        createProfissional,
        findProfissionais,
        findProfissional,
        updateProfissional
    }
}