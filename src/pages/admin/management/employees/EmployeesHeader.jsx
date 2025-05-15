function EmployeesHeader() {
    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
                <h1 className="text-3xl font-bold">Empleados</h1>
                <p className="text-gray-500">Gestiona los empleados de tu negocio</p>
            </div>
        </div>
    );
}

export default EmployeesHeader;