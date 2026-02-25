import subprocess, sys, time
def run_parallel(commands):
    processes = []
    for cmd in commands:
        p = subprocess.Popen(cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        processes.append(p)
    for p in processes:
        stdout, stderr = p.communicate()
        if p.returncode != 0:
            print(f"Error in process: {stderr.decode()}")
run_parallel(sys.argv[1:])
