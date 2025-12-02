import api from 'src/services/api';

export function useUsers() {

    const createUser = async (User) => {
        try {
            const response = await api.post(`/user`, User)
            return { success: true, data: response.data, message: 'Usuário cadastrado com sucesso!' }
        } catch (error) {
            console.error('Erro ao cadastrar o Usuário:', error);
            return { success: false, message: error };
        }
    }

    const findServicos = async () => {
        try {
            const response = await api.get('/servicos')
            return { success: true, data: response.data }
        } catch (error) {
            console.error('Erro ao buscar Serviços', error);
            return { success: false, message: error };
        }
    }
    const findServico = async (id) => {
        try {
            const response = await api.get(`/servicos/${id}`)
            return { success: true, data: response.data }
        } catch (error) {
            console.error('Erro ao buscar o Serviço:', error);
            return { success: false, message: error };
        }
    }

    const updateServico = async (id, servico) => {
        try {
            console.log(servico)
            const response = await api.put(`/servicos/${id}`, servico)
            return { success: true, data: response.data, message: 'Serviço alterado com sucesso!' }
        } catch (error) {
            console.error('Erro ao alterar o Serviço:', error);
            return { success: false, message: error };
        }
    }

    return {
        createUser,
        findServicos,
        findServico,
        updateServico
    }
}