/* eslint-disable react/prop-types */
export default function EnvConfig({ dbConfig, jbossConfig }) {

    return (
        <div className='environmentConfig'>
            <div className='config'>
                <h1 className='configTitle'>Database Configuration</h1>
                <p>{dbConfig.name}</p>
                <p>{dbConfig.ipAddress}</p>
                <p>{dbConfig.port}</p>
                <p>{dbConfig.sid}</p>
                <p>{dbConfig.username}</p>
                <div className='configButtons'>
                    <button>Test</button>
                    <button>Reconnect</button>
                    <button className='editButton'>Edit</button>
                </div>
            </div>
            <div className='config'>
                <h1 className='configTitle'>Server Configuration</h1>
                <p>{jbossConfig.name}</p>
                <p>{jbossConfig.ipAddress}</p>
                <p>{jbossConfig.port}</p>
                <div className='configButtons'>
                    <button>Test</button>
                    <button className='editButton'>Edit</button>
                </div>
            </div>
            <div className='config'>
                <h1 className='configTitle'>UNIX Configuration</h1>
                <p>{jbossConfig.name}</p>
                <p>{jbossConfig.ipAddress}</p>
                <p>{jbossConfig.port}</p>
                <div className='configButtons'>
                    <button>Test</button>
                    <button className='editButton'>Edit</button>
                </div>
            </div>
        </div>
    )
}
